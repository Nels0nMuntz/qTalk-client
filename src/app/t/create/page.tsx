'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CreateSubtalkPayload } from '@/lib/validators';
import { notify } from '@/lib/utils';
import { useCustomNotifications } from '@/hooks';
import { CreateSubtalkResponse } from "@/app/types";

export default function Page() {
  const router = useRouter();
  const [input, setInput] = useState<string>('');
  const { loginNotification } = useCustomNotifications();

  const { mutate: createCommunity, isPending } = useMutation({
    mutationFn: async () => {
      const payload: CreateSubtalkPayload = {
        name: input,
      };

      const { data } = await axios.post<CreateSubtalkResponse>('/api/subtalk', payload);
      return data;
    },
    onSuccess: (data) => {
      router.push(`/t/${data.name}`)
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          return notify({
            title: 'Subtalk already exists.',
            description: 'Please choose a different name.',
            variant: 'error',
          });
        }
        if (error.response?.status === 422) {
          return notify({
            title: 'Invalid subtalk name.',
            description: 'Please choose a name between 2 and 22 letters.',
            variant: 'error',
          });
        }
        if (error.response?.status === 401) {
          return loginNotification();
        }
      }
      notify({
        title: 'There was an error.',
        description: 'Could not create subreddit.',
        variant: 'error',
      });
    },
  });

  return (
    <div className="container flex items-center h-full max-w-3xl mx-auto">
      <div className="relative w-full h-fit p-4 space-y-6 bg-white rounded-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Create a Community</h1>
        </div>

        <hr className="bg-red-500 h-px" />

        <div>
          <p className="text-lg font-medium">Name</p>
          <p className="pb-2 text-xs">
            Community names including capitalization cannot be changed.
          </p>
          <div className="relative">
            <p className="absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-zinc-400">
              t/
            </p>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="pl-6"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            disabled={isPending}
            variant="ghost"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            isLoading={isPending}
            disabled={input.length === 0}
            onClick={() => createCommunity()}
          >
            Create Community
          </Button>
        </div>
      </div>
    </div>
  );
}
