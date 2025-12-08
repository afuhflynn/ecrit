import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db/drizzle";
import { notes } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { cacheKeys, getCache, setCache } from "@/lib/cache";

type Params = { params: Promise<{ slug: string }> };

const CACHE_TTL = 60 * 5;

export const GET = async (_request: NextRequest, { params }: Params) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const cacheKey = cacheKeys.noteBySlug(session.user.id, slug);

  const cached = await getCache(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  const note = await db
    .select()
    .from(notes)
    .where(and(eq(notes.slug, slug), eq(notes.userId, session.user.id)))
    .limit(1);

  if (note.length === 0) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  await setCache(cacheKey, note[0], CACHE_TTL);

  return NextResponse.json(note[0]);
};
