import { z } from "zod";

export const bookmarkSchema = z.object({
  url: z.string().url(),
  title: z.string().min(1),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const bookmarkUpdateSchema = z.object({
  url: z.string().url().optional(),
  title: z.string().min(1).optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type BookmarkInput = z.infer<typeof bookmarkSchema>;
export type BookmarkUpdateInput = z.infer<typeof bookmarkUpdateSchema>;
