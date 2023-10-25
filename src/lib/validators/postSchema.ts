import { z } from 'zod';

export const postSchema = z.object({
  title: z
    .string()
    .min(2, { message: 'Title must be longer than 2 characters' })
    .max(128, { message: 'Title must be at least 128 characters' }),
  subtalkId: z.string(),
  content: z.any(),
});

export type CreatePostPayload = z.infer<typeof postSchema>;
