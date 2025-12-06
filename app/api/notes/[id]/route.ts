import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db/drizzle";
import { notes } from "@/db/schema";
import { eq, and } from "drizzle-orm";

type Params = { params: Promise<{ id: string }> };

// GET /api/notes/[id] - Get a single note
export const GET = async (_request: NextRequest, { params }: Params) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const note = await db
    .select()
    .from(notes)
    .where(and(eq(notes.id, id), eq(notes.userId, session.user.id)))
    .limit(1);

  if (note.length === 0) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  return NextResponse.json(note[0]);
};

// PATCH /api/notes/[id] - Update a note
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
      ...(content && { content }),
    })
    .where(and(eq(notes.id, id), eq(notes.userId, session.user.id)))
    .returning();

  return NextResponse.json(updatedNote[0]);
};

// DELETE /api/notes/[id] - Delete a note
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

  return NextResponse.json({ message: "Note deleted successfully" });
};
