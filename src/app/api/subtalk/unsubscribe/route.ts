import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { buildResponse } from '@/lib/utils';
import { subtalkSubscriptionSchema } from '@/lib/validators';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return buildResponse('unauthorized', { status: 401 });
    }

    const body = await req.json();

    const { subtalkId } = subtalkSubscriptionSchema.parse(body);

    const subscriptionExists = await db.subscription.findFirst({
      where: {
        subtalkId,
        userId: session.user.id,
      },
    });

    if (!subscriptionExists) {
      return buildResponse('You are not subscribed to this subtalk', {
        status: 400,
      });
    }

    await db.subscription.delete({
      where: {
        userId_subtalkId: {
          subtalkId,
          userId: session.user.id,
        },
      },
    });

    return buildResponse({ subtalkId }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return buildResponse('Invalid request data passed', { status: 422 });
    }

    return buildResponse('Internal server error', { status: 500 });
  }
}
