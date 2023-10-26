import React, { useState } from 'react';
import { ArrowBigDown, ArrowBigUp } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { CommentVote, VoteType } from '@prisma/client';
import axios, { AxiosError } from 'axios';
import { usePrevious } from '@mantine/hooks';
import { useCustomNotifications } from '@/hooks';
import { CommentVotePayload } from '@/lib/validators';
import { cn, notify } from '@/lib/utils';
import { Button } from '../ui/button';

type PartialVote = Pick<CommentVote, 'type'>;

interface Props {
  commentId: string;
  initialVote: PartialVote | null;
  initialVotesCount: number;
}

export default function CommentVotes({
  commentId,
  initialVote,
  initialVotesCount,
}: Props) {
  const { loginNotification } = useCustomNotifications();
  const [votesCount, setVotesCount] = useState(initialVotesCount);
  const [currentVote, setCurrentVote] = useState(initialVote);
  const prevVote = usePrevious(currentVote);

  const { mutate: vote } = useMutation({
    mutationFn: async (voteType: VoteType) => {
      const payload: CommentVotePayload = {
        commentId,
        voteType,
      };

      const { data } = await axios.patch(
        '/api/subtalk/post/comment/vote',
        payload,
      );
      return data;
    },
    onMutate: (voteType) => {
      if (currentVote?.type === voteType) {
        setCurrentVote(null);
        if (voteType === 'UP') {
          setVotesCount((prev) => prev - 1);
        } else {
          setVotesCount((prev) => prev + 1);
        }
      } else {
        setCurrentVote({ type: voteType });
        if (voteType === 'UP') {
          setVotesCount((prev) => prev + (currentVote ? 2 : 1));
        } else {
          setVotesCount((prev) => prev - (currentVote ? 2 : 1));
        }
      }
    },
    onError: (error, voteType) => {
      if (voteType === 'UP') {
        setVotesCount((prev) => prev - 1);
      } else {
        setVotesCount((prev) => prev + 1);
      }
      setCurrentVote(prevVote || null);

      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return loginNotification();
        }
      }

      return notify({
        variant: 'error',
        title: 'Something went wrong.',
        description: 'Your vote was not registered. Please try again.',
      });
    },
  });

  const upvote = () => vote('UP');
  const downvote = () => vote('DOWN');

  return (
    <div className="flex gap-1">
      <Button size="xs" variant="ghost" aria-label="upvote" onClick={upvote}>
        <ArrowBigUp
          className={cn('h-5 w-5 text-zinc-700', {
            'text-emerald-500 fill-emerald-500': currentVote?.type === 'UP',
          })}
        />
      </Button>
      <p className="text-center py-2 px-1 font-medium text-xs text-zinc-900">
        {votesCount}
      </p>
      <Button
        size="xs"
        variant="ghost"
        aria-label="downvote"
        className={cn({
            'text-emerald-500': currentVote?.type === 'DOWN',
        })}
        onClick={downvote}
      >
        <ArrowBigDown
          className={cn('h-5 w-5 text-zinc-700', {
            'text-red-500 fill-red-500': currentVote?.type === 'DOWN',
          })}
        />
      </Button>
    </div>
  );
}
