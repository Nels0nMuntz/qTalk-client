'use client';

import React, { useEffect, useState } from 'react';
import { VoteType } from '@prisma/client';
import { useCustomNotifications } from '@/hooks';
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
  const [votesCount, setVoteCount] = useState(initialVoteCount);
  const [currentVote, setCurrentVote] = useState(initialVote);
  const { loginNotification } = useCustomNotifications();
  const prevVote = usePrevious(currentVote);

  useEffect(() => {
    setCurrentVote(initialVote);
  }, [initialVote]);

  const { mutate: vote } = useMutation({
    mutationFn: async (voteType: VoteType) => {
      const payload: PostVotePayload = {
        postId,
        voteType,
      };
      await axios.patch('/api/subtalk/post/vote', payload);
    },
    onError: (error, voteType) => {
      if (voteType === 'UP') {
        setVoteCount((prev) => prev - 1);
      } else {
        setVoteCount((prev) => prev + 1);
      }

      // reset current vote
      setCurrentVote(prevVote || null);

      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return loginNotification();
        }
      }

      return notify({
        title: 'Something went wrong.',
        description: 'Your vote was not registered. Please try again.',
        variant: 'error',
      });
    },
    onMutate: (voteType: VoteType) => {
      if (voteType === currentVote) {
        // User is voting the same way again, so remove their vote
        setCurrentVote(null);
        if (voteType === 'UP') {
          setVoteCount((prev) => prev - 1);
        } else {
          setVoteCount((prev) => prev + 1);
        }
      } else {
        // User is voting in the opposite direction, so subtract 2
        setCurrentVote(voteType);
        if (voteType === 'UP') {
          setVoteCount((prev) => prev + (currentVote ? 2 : 1));
        } else {
          setVoteCount((prev) => prev - (currentVote ? 2 : 1));
        }
      }
    },
  });

  const upvote = () => vote('UP');
  const downvote = () => vote('DOWN');

  return (
    <div className="flex flex-col gap-4 sm:gap-0 pr-6 sm:w-20 pb-4 sm:pb-0">
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
