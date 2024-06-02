import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { VoteType } from '@prisma/client';
import { useCustomNotifications } from './useCustomNotifications';
import { usePrevious } from '@mantine/hooks';
import { useMutation } from '@tanstack/react-query';
import { PostVotePayload } from '@/lib/validators';
import { cn, notify } from '@/lib/utils';

interface Props {
  postId: string;
  initialVote: VoteType | null;
  initialVoteCount: number;
}

export function usePostVotes({ initialVote, initialVoteCount, postId }: Props) {
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

  return { votesCount, currentVote, upvote, downvote };
}
