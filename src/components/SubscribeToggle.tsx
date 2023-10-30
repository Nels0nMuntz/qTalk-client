'use client';

import React, { startTransition } from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { useMutation } from '@tanstack/react-query';
import { SubscribeToSubtalkPayload } from '@/lib/validators';
import { useCustomNotifications } from '@/hooks';
import { notify } from '@/lib/utils';
import { SubscriptionResponse } from '@/types';

interface Props {
  isSubscribed: boolean;
  subtalkId: string;
  subtalkName: string;
}

export default function SubscribeToggle({
  isSubscribed,
  subtalkId,
  subtalkName,
}: Props) {
  const router = useRouter();
  const { loginNotification } = useCustomNotifications();

  const { mutate: subscribe, isPending: subscribeInProgress } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubtalkPayload = {
        subtalkId,
      };

      const { data } = await axios.post<SubscriptionResponse>(
        '/api/subtalk/subscribe',
        payload,
      );
      return data;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return loginNotification();
        }
      }
      return notify({
        title: 'There was a problem.',
        description: 'Something went wrong. Please try again.',
        variant: 'error',
      });
    },
    onSuccess: () => {
      router.refresh();
      notify({
        title: 'Subscribed!',
        description: `You are now subscribed to r/${subtalkName}`,
        variant: 'success',
      });
    },
  });

  const { mutate: unsubscribe, isPending: unsubscribeInProgress } = useMutation(
    {
      mutationFn: async () => {
        const payload: SubscribeToSubtalkPayload = {
          subtalkId,
        };

        const { data } = await axios.post<SubscriptionResponse>(
          '/api/subtalk/unsubscribe',
          payload,
        );
        return data;
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            return loginNotification();
          }
        }
        return notify({
          title: 'There was a problem.',
          description: 'Something went wrong. Please try again.',
          variant: 'error',
        });
      },
      onSuccess: () => {
        startTransition(() => {
          router.refresh();
        });
        notify({
          title: 'Unsubscribed!',
          description: `You are now unsubscribed from r/${subtalkName}`,
          variant: 'success',
        });
      },
    },
  );

  const handleSubscribe = () => subscribe();
  const handleUnsubscribe = () => unsubscribe();

  return isSubscribed ? (
    <Button
      className="w-full mt-1 mb-4"
      isLoading={unsubscribeInProgress}
      onClick={handleUnsubscribe}
    >
      Leave community
    </Button>
  ) : (
    <Button
      className="w-full mt-1 mb-4"
      isLoading={subscribeInProgress}
      onClick={handleSubscribe}
    >
      Join to community
    </Button>
  );
}
