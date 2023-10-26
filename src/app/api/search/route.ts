import { db } from '@/lib/db';
import { buildResponse } from '@/lib/utils';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const query = url.searchParams.get('q');

    if (!query) {
      return buildResponse('Invalid query', { status: 400 });
    }

    const results = await db.subtalk.findMany({
      where: {
        name: {
          startsWith: query,
        },
      },
      include: {
        _count: true,
      },
      take: 5,
    });

    return buildResponse(results);
  } catch (error) {
    return buildResponse('Internal server error');
  }
}
