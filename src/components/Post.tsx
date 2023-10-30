'use client';

import { formatTimeToNow } from '@/lib/utils';
import { ExtendedPost } from '@/types/db';
import { Post, Vote } from '@prisma/client';
import { MessageSquare } from 'lucide-react';
import Link from 'next/link';
import React, { useRef } from 'react';
import EditorOutput from './EditorOutput';
import PostVoteClient from './post-vote/PostVoteClient';

type PartialVote = Pick<Vote, 'type'>;

interface Props {
  post: ExtendedPost;
  votesCount: number;
  currentVote?: PartialVote;
}

export default function Post({ post, votesCount, currentVote }: Props) {
  const subtalkName = post.subtalk.name;
  const commentCount = post.comments.length;

  const pRef = useRef<HTMLParagraphElement>(null);
  return (
    <div className="rounded-md bg-white shadow">
      <div className="px-6 py-4 flex justify-between">
        <PostVoteClient
          postId={post.id}
          initialVote={currentVote?.type || null}
          initialVoteCount={votesCount}
        />
        <div className="w-0 flex-1">
          <div className="max-h-40 mt-1 text-xs text-gray-500">
            {subtalkName ? (
              <>
                <a
                  href={`/t/${subtalkName}`}
                  className="underline text-zinc-900 text-sm underline-offset-2"
                >
                  t/{subtalkName}
                </a>
                <span className="px-1">•</span>
              </>
            ) : null}
            <span>Posted by u/{post.author.username}</span>{' '}
            {formatTimeToNow(new Date(post.createdAt))}
          </div>
          <a href={`/t/${subtalkName}/post/${post.id}`}>
            <h1 className="text-lg font-semibold py-2 leading-6 text-gray-900">
              {post.title}
            </h1>
          </a>
          <div
            className="relative max-h-40 w-full text-sm overflow-clip"
            ref={pRef}
          >
            <EditorOutput content={post.content} />
            {pRef.current?.clientHeight === 160 ? (
              <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent"></div>
            ) : null}
          </div>
        </div>
      </div>
      <div className="bg-gray-50 z-20 text-sm px-4 py-4 sm:px-6">
        <Link
          href={`/t/${subtalkName}/post/${post.id}`}
          className="w-fit flex items-center gap-2"
        >
          <MessageSquare className="h-4 w-4" /> {commentCount} comments
        </Link>
      </div>
    </div>
  );
}
