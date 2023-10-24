import { db } from '@/lib/db';
import { buildResponse } from '@/lib/utils';
import { signUpFormSchema } from '@/lib/validators';
import { hash } from 'bcrypt';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, username, password } = signUpFormSchema.parse(body);

    const userByEmail = await db.user.findFirst({
      where: {
        email,
      },
    });
    const userByUsername = await db.user.findFirst({
      where: {
        username,
      },
    });
    if (userByEmail || userByUsername) {
      return buildResponse('Email or username are taken', { status: 422 });
    }

    const hashedPassword = await hash(password, 10);
    await db.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });
    return buildResponse('User was created', { status: 201 });
  } catch (error) {
    console.log(error);

    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return buildResponse('Internal server error', { status: 500 });
  }
}
