'use client';

import React, { useEffect, useRef } from 'react';
import { useIntersection } from '@mantine/hooks';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/constants';
import { ExtendedPost } from '@/types/db';
import Post from './Post';

const getPosts = (subtalkName?: string) => {
  return async ({ pageParam }: { pageParam: number }) => {
    const query =
      `/api/posts?limit=${INFINITE_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}` +
      (!!subtalkName ? `subtalkName=${subtalkName}` : '');
    const { data } = await axios.get<ExtendedPost>(query);
    return data;
  };
};

interface Props {
  initialPosts: ExtendedPost[];
  subtalkName?: string;
}

export default function PostFeed({ initialPosts, subtalkName }: Props) {
  const { data: session } = useSession();
  const lastPostRef = useRef<HTMLElement>();

  const { entry, ref } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['infinite-query'],
    queryFn: getPosts(subtalkName),
    initialPageParam: 1,
    getNextPageParam: (_, pages) => pages.length + 1,
    initialData: {
      pages: initialPosts,
      pageParams: [1],
    },
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  const posts = data?.pages.flatMap((page) => page) ?? initialPosts;

  return (
    <ul className="flex flex-col col-span-2 space-y-6">
      {posts.map((post, index) => {
        const votesCount = post.votes.reduce((acc, curr) => {
          if (curr.type === 'UP') return acc + 1;
          if (curr.type === 'DOWN') return acc - 1;
          return acc;
        }, 0);
        const currentVote = post.votes.find(
          (vote) => vote.userId === session?.user.id,
        );
        const isLastItem = index === posts.length - 1;
        return (
          <li key={post.id} ref={isLastItem ? ref : undefined}>
            <Post
              post={post}
              votesCount={votesCount}
              currentVote={currentVote}
            />
          </li>
        );
      })}
    </ul>
  );
}
