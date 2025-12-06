import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db/drizzle";
import { notes } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { nanoid } from "nanoid";

// GET /api/notes - List all notes for authenticated user
export const GET = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userNotes = await db
    .select()
    .from(notes)
    .where(eq(notes.userId, session.user.id))
    .orderBy(desc(notes.createdAt));

  return NextResponse.json(userNotes);
};

// POST /api/notes - Create a new note
export const POST = async (request: NextRequest) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, slug, content } = body;

  if (!title || !slug || !content) {
    return NextResponse.json(
      { error: "Title, slug, and content are required" },
      { status: 400 }
    );
  }

  const newNote = await db
    .insert(notes)
    .values({
      id: nanoid(),
      title,
      slug,
      content,
      userId: session.user.id,
    })
    .returning();

  return NextResponse.json(newNote[0], { status: 201 });
};
