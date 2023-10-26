import React from 'react';
import { db } from '@/lib/db';
import PostFeed from "./PostFeed";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/constants';

export default async function GeneralFeed() {
  const posts = await db.post.findMany({
    include: {
      author: true,
      comments: true,
      subtalk: true,
      votes: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: INFINITE_SCROLLING_PAGINATION_RESULTS,
  });
  return <PostFeed initialPosts={posts}/>;
}
