'use client';

import React, { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { useIntersection } from '@mantine/hooks';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/constants';
import { ExtendedPost } from '@/types/db';
import Post from './Post';

const sleep = (time: number) => new Promise(res => setTimeout(res, time))

const getPosts = (subtalkName?: string) => {
  return async ({ pageParam }: { pageParam: number }) => {
    // await sleep(3000)
    const query =
      `/api/posts?limit=${INFINITE_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}` +
      (!!subtalkName ? `&subtalkName=${subtalkName}` : '');
    const { data } = await axios.get<ExtendedPost[]>(query);
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
    queryKey: ['infinite-query', subtalkName],
    queryFn: getPosts(subtalkName),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.length === 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    refetchOnMount: 'always',
    initialData: {
      pages: [initialPosts],
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
    <div className="flex flex-col col-span-2 space-y-6">
      <ul className="flex flex-col space-y-6">
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
          if (isLastItem) {
            return (
              <li key={post.id} ref={ref}>
                <Post
                  post={post}
                  votesCount={votesCount}
                  currentVote={currentVote}
                />
              </li>
            );
          } else {
            return (
              <li key={post.id}>
                <Post
                  post={post}
                  votesCount={votesCount}
                  currentVote={currentVote}
                />
              </li>
            );
          }
        })}
      </ul>
      {isFetchingNextPage && (
        <div className="flex justify-center">
          <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
        </div>
      )}
    </div>
  );
}
