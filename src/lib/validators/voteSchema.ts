import { z } from 'zod';

export const postVoteSchema = z.object({
  postId: z.string(),
  voteType: z.enum(['UP', 'DOWN']),
});

export type PostVotePayload = z.infer<typeof postVoteSchema>;

export const commentVoteSchema = z.object({
  commentId: z.string(),
  voteType: z.enum(['UP', 'DOWN']),
});

export type CommentVotePayload = z.infer<typeof commentVoteSchema>;
