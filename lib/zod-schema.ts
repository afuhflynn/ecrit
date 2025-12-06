import { z } from "zod";

export const noteSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
});

export const noteContentSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  content: z.string().min(1),
});

export type NoteSchema = z.infer<typeof noteSchema>;
export type NoteContentSchema = z.infer<typeof noteContentSchema>;
