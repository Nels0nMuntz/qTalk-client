import { Comment, Post, Subtalk, User, Vote } from '@prisma/client';

export type ExtendedPost = Post & {
  subtalk: Subtalk;
  votes: Vote[];
  author: User;
  comments: Comment[];
};
