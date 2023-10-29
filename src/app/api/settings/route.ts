import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { buildResponse } from '@/lib/utils';
import { settingsSchema } from '@/lib/validators/settingsSchema';
import { z } from 'zod';

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return buildResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { name } = settingsSchema.parse(body);

    const usernameExists = await db.user.findFirst({
      where: {
        username: name,
      },
    });

    if (usernameExists) {
      return buildResponse('Username is taken', { status: 409 });
    }

    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        username: name,
      },
    });

    return buildResponse('Username was updated');
  } catch (error) {
    if (error instanceof z.ZodError) {
      return buildResponse('Invalid request data passed', { status: 422 });
    }

    return buildResponse('Internal server error', { status: 500 });
  }
}
