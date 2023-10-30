import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { buildResponse } from '@/lib/utils';
import { postSchema } from '@/lib/validators';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return buildResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { title, content, subtalkId } = postSchema.parse(body);

    // verify user is subscribed to passed subreddit id
    const subscription = await db.subscription.findFirst({
      where: {
        subtalkId,
        userId: session.user.id,
      },
    });

    if (!subscription) {
      return buildResponse('Subscribe to community', { status: 403 });
    }

    await db.post.create({
      data: {
        title,
        content,
        authorId: session.user.id,
        subtalkId,
      },
    });

    return buildResponse('Post was created', { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return buildResponse('Invalid request data passed', { status: 422 });
    }

    return buildResponse('Internal server error', { status: 500 });
  }
}
