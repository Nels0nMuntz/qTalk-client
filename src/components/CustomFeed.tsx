import React from 'react';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/constants';
import PostFeed from './PostFeed';

export default async function CustomFeed() {
  const session = await getAuthSession();
  const followedCommunities = await db.subscription.findMany({
    where: {
      userId: session?.user.id,
    },
    include: {
      subtalk: true,
    },
  });
  const followedCommunitiesIds = followedCommunities.map(({ subtalk }) => subtalk.id);
  
  const posts = await db.post.findMany({
    where: {
      subtalk: {
        id: {
          in: followedCommunitiesIds,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      author: true,
      comments: true,
      subtalk: true,
      votes: true,
    },
    take: INFINITE_SCROLLING_PAGINATION_RESULTS,
  });
  
  return <PostFeed initialPosts={posts} />;
}
