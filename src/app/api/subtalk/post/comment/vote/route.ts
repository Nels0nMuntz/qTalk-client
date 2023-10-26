import { z } from "zod";
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';
import { buildResponse } from '@/lib/utils';
import { commentVoteSchema } from '@/lib/validators';

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return buildResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { commentId, voteType } = commentVoteSchema.parse(body);
    const userId = session.user.id;

    const existingVote = await db.commentVote.findFirst({
      where: {
        userId: session.user.id,
        commentId,
      },
    });

    if (existingVote) {
      // if vote type is the same as existing vote, delete the vote
      if (existingVote.type === voteType) {
        await db.commentVote.delete({
          where: {
            userId_commentId: {
              commentId,
              userId: session.user.id,
            },
          },
        });
        return buildResponse('Vote was deleted');
      } else {
        // if vote type is different, update the vote
        await db.commentVote.update({
          where: {
            userId_commentId: {
              commentId,
              userId: session.user.id,
            },
          },
          data: {
            type: voteType,
          },
        });
        return buildResponse('Vote was updated');
      }
    }
    // if no existing vote, create a new one
    await db.commentVote.create({
      data: {
        type: voteType,
        userId: session.user.id,
        commentId,
      },
    });
    return buildResponse('Vote was created');
  } catch (error) {
    if (error instanceof z.ZodError) {
      return buildResponse('Invalid request data passed', { status: 422 });
    }

    return buildResponse('Internal server error', { status: 500 });
  }
}
