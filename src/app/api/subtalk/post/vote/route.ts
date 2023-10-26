import { z } from 'zod';
import { Post, User, Vote, VoteType } from '@prisma/client';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { redis } from '@/lib/redis';
import { buildResponse } from '@/lib/utils';
import { postVoteSchema } from '@/lib/validators';
import { CachedPost } from '@/types';

const CACHE_AFTER_UPVOTES = 1;

interface ExtendedPost extends Post {
  author: User;
  votes: Vote[];
}

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return buildResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { postId, voteType } = postVoteSchema.parse(body);
    const userId = session.user.id;

    const existingVote = await db.vote.findFirst({
      where: {
        postId,
        userId,
      },
    });

    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: true,
        votes: true,
      },
    });

    if (!post) {
      return buildResponse('post not found', { status: 404 });
    }

    if (existingVote) {
      // if vote type is the same as existing vote, delete the vote
      if (existingVote.type === voteType) {
        await db.vote.delete({
          where: {
            userId_postId: {
              userId,
              postId,
            },
          },
        });

        await storePostData({ post, vote: null });

        return buildResponse('Vote deleted');
      }
      // if vote type is not the same as existing vote, update the vote
      await db.vote.update({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
        data: {
          type: voteType,
        },
      });

      await storePostData({ post, vote: voteType });

      return buildResponse('Vote updated');
    }

    // if vote does not exist, create new one
    await db.vote.create({
      data: {
        postId,
        userId,
        type: voteType,
      },
    });

    await storePostData({ post, vote: voteType });

    return buildResponse('Vote created');
  } catch (error) {
    if (error instanceof z.ZodError) {
      return buildResponse('Invalid request data passed', { status: 422 });
    }

    return buildResponse('Internal server error', { status: 500 });
  }
}

function countVotes(votes: Vote[]) {
  return votes.reduce((acc, vote) => {
    if (vote.type === 'UP') return acc + 1;
    if (vote.type === 'DOWN') return acc - 1;
    return acc;
  }, 0);
}

async function storePostData({
  post,
  vote,
}: {
  post: ExtendedPost;
  vote: VoteType | null;
}) {
  const voutsCount = countVotes(post.votes);

  if (voutsCount >= CACHE_AFTER_UPVOTES) {
    const cachePayload: CachedPost = {
      authorUsername: post.author.username ?? '',
      content: JSON.stringify(post.content),
      id: post.id,
      title: post.title,
      currentVote: vote,
      createdAt: post.createdAt,
    };

    await redis.hset(`post:${post.id}`, cachePayload);
  }
}
