import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { buildResponse } from '@/lib/utils';
import { createSubtalkSchema } from '@/lib/validators';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return buildResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { name } = createSubtalkSchema.parse(body);
    const subtalkExist = await db.subtalk.findFirst({
      where: {
        name,
      },
    });

    if (subtalkExist) {
      return buildResponse('Subtalk already exists', { status: 409 });
    }

    const subtalk = await db.subtalk.create({
      data: {
        name,
        creatorId: session.user.id,
      },
    });

    await db.subscription.create({
      data: {
        userId: session.user.id,
        subtalkId: subtalk.id,
      },
    });

    return buildResponse({ name: subtalk.name }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return buildResponse('Invalid request data passed', { status: 422 });
    }

    return buildResponse('Internal server error', { status: 500 });
  }
}
