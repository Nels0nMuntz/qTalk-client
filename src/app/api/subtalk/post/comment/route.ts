import { z } from 'zod';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';
import { buildResponse } from '@/lib/utils';
import { commentSchema } from '@/lib/validators/commentSchema';

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return buildResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { postId, replyToId, text } = commentSchema.parse(body);

    await db.comment.create({
      data: {
        text,
        postId,
        authorId: session.user.id,
        replyToId,
      },
    });

    return buildResponse('Comment was created');
  } catch (error) {
    if (error instanceof z.ZodError) {
      return buildResponse('Invalid request data passed', { status: 422 });
    }

    return buildResponse('Internal server error', { status: 500 });
  }
}
