import { z } from 'zod';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';
import { buildResponse } from '@/lib/utils';

export async function GET(req: Request) {
  const url = new URL(req.url);

  const session = await getAuthSession();

  let followedCommunitiesIds: string[] = [];

  if (session) {
    const followedCommunities = await db.subscription.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        subtalk: true,
      },
    });

    followedCommunitiesIds = followedCommunities.map(
      ({ subtalk }) => subtalk.id,
    );
  }

  try {
    const { page, limit, subtalkName } = z
      .object({
        limit: z.string(),
        page: z.string(),
        subtalkName: z.string().nullish(),
      })
      .parse({
        subtalkName: url.searchParams.get('subtalkName'),
        limit: url.searchParams.get('limit'),
        page: url.searchParams.get('page'),
      });

    let whereClause = {};

    if (subtalkName) {
      whereClause = {
        subtalk: {
          name: subtalkName,
        },
      };
    } else if (session) {
      whereClause = {
        subtalk: {
          id: {
            in: followedCommunitiesIds,
          },
        },
      };
    }    

    const posts = await db.post.findMany({
      where: whereClause,
      include: {
        subtalk: true,
        votes: true,
        author: true,
        comments: true,
      },
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      orderBy: {
        createdAt: 'desc',
      },
    });

    return buildResponse(posts, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return buildResponse('Invalid request data passed', { status: 422 });
    }

    return buildResponse('Internal server error', { status: 500 });
  }
}
