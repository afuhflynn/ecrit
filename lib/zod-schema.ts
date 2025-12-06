import { z } from "zod";

export const noteSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
});

export type NoteSchema = z.infer<typeof noteSchema>;
