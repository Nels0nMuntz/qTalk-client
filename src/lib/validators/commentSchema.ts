import { z } from 'zod';

export const commentSchema = z.object({
  postId: z.string(),
  replyToId: z.string().optional(),
  text: z.string(),
});

export type CreateCommentPayload = z.infer<typeof commentSchema>;
