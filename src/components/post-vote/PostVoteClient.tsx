'use client';

import React, { useEffect, useState } from 'react';
import { VoteType } from '@prisma/client';
import { useCustomNotifications, usePostVotes } from '@/hooks';
import { usePrevious } from '@mantine/hooks';
import { Button } from '../ui/button';
import { ArrowBigDown, ArrowBigUp } from 'lucide-react';
import { cn, notify } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { PostVotePayload } from '@/lib/validators';
import axios, { AxiosError } from 'axios';

interface Props {
  postId: string;
  initialVote: VoteType | null;
  initialVoteCount: number;
}

export default function PostVoteClient({
  postId,
  initialVote,
  initialVoteCount,
}: Props) {
  const { votesCount, currentVote, upvote, downvote } = usePostVotes({
    postId,
    initialVote,
    initialVoteCount,
  });

  return (
    <div className="flex flex-col group-[.is-post-page]:flex-row self-start gap-4 sm:gap-0 pr-4 mb:pr-6 sm:w-20 pb-4 sm:pb-0">
      <Button size="sm" variant="ghost" onClick={upvote}>
        <ArrowBigUp
          className={cn('h-5 w-5 text-zinc-700', {
            'text-emerald-500 fill-emerald-500': currentVote === 'UP',
          })}
        />
        <span className="sr-only">Upvote</span>
      </Button>
      <p className="text-center py-2 font-medium text-sm text-zinc-900">
        {votesCount}
      </p>
      <Button
        size="sm"
        variant="ghost"
        className={cn({
          'text-emerald-500': currentVote === 'DOWN',
        })}
        onClick={downvote}
      >
        <ArrowBigDown
          className={cn('h-5 w-5 text-zinc-700', {
            'text-red-500 fill-red-500': currentVote === 'DOWN',
          })}
        />
        <span className="sr-only">Downvote</span>
      </Button>
    </div>
  );
}
