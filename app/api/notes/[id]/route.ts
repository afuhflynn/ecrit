import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db/drizzle";
import { notes } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import {
  cacheKeys,
  getCache,
  setCache,
  deleteCache,
  deleteCacheKeys,
} from "@/lib/cache";

type Params = { params: Promise<{ id: string }> };

const CACHE_TTL = 60 * 5;

export const GET = async (_request: NextRequest, { params }: Params) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const cacheKey = cacheKeys.note(session.user.id, id);

  const cached = await getCache(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  const note = await db
    .select()
    .from(notes)
    .where(and(eq(notes.id, id), eq(notes.userId, session.user.id)))
    .limit(1);

  if (note.length === 0) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  await setCache(cacheKey, note[0], CACHE_TTL);

  return NextResponse.json(note[0]);
};

export const PATCH = async (request: NextRequest, { params }: Params) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { title, slug, content } = body;

  const existingNote = await db
    .select()
    .from(notes)
    .where(and(eq(notes.id, id), eq(notes.userId, session.user.id)))
    .limit(1);

  if (existingNote.length === 0) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  const updatedNote = await db
    .update(notes)
    .set({
      ...(title && { title }),
      ...(slug && { slug }),
      ...(content !== undefined && { content }),
      updatedAt: new Date(),
    })
    .where(and(eq(notes.id, id), eq(notes.userId, session.user.id)))
    .returning();

  await Promise.all([
    deleteCache(cacheKeys.note(session.user.id, id)),
    deleteCache(cacheKeys.noteBySlug(session.user.id, existingNote[0].slug)),
    deleteCacheKeys(cacheKeys.allNotesListKeys(session.user.id)),
  ]);

  return NextResponse.json(updatedNote[0]);
};

export const DELETE = async (_request: NextRequest, { params }: Params) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const existingNote = await db
    .select()
    .from(notes)
    .where(and(eq(notes.id, id), eq(notes.userId, session.user.id)))
    .limit(1);

  if (existingNote.length === 0) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  await db
    .delete(notes)
    .where(and(eq(notes.id, id), eq(notes.userId, session.user.id)));

  await Promise.all([
    deleteCache(cacheKeys.note(session.user.id, id)),
    deleteCache(cacheKeys.noteBySlug(session.user.id, existingNote[0].slug)),
    deleteCacheKeys(cacheKeys.allNotesListKeys(session.user.id)),
  ]);

  return NextResponse.json({ message: "Note deleted successfully" });
};
