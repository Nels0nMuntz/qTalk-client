'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { useMutation } from '@tanstack/react-query';
import { CreateCommentPayload } from '@/lib/validators/commentSchema';
import { useCustomNotifications } from '@/hooks';
import { notify } from '@/lib/utils';

interface Props {
  postId: string;
  replyToId?: string;
}

export default function CreateComment({ postId, replyToId }: Props) {
  const router = useRouter();
  const { loginNotification } = useCustomNotifications();
  const [value, setValue] = useState<string>('');
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setValue(e.target.value);

  const { mutate: comment, isPending } = useMutation({
    mutationFn: async (payload: CreateCommentPayload) => {
      const { data } = await axios.post('/api/subtalk/post/comment', payload);
      return data;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return loginNotification();
        }
      }
      notify({
        variant: 'error',
        title: 'Something went wrong.',
        description: "Comment wasn't created successfully. Please try again.",
      });
    },
    onSuccess: () => {
      setValue('');
      router.refresh();
    },
  });
  const postComment = () => {
    comment({
      postId,
      replyToId,
      text: value,
    });
  };

  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="comment">Your comment</Label>
      <div className="mt-2">
        <Textarea
          id="comment"
          value={value}
          onChange={handleChange}
          rows={1}
          placeholder="What are your thoughts?"
        />

        <div className="mt-2 flex justify-end">
          <Button
            isLoading={isPending}
            disabled={value.length === 0}
            onClick={postComment}
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
}
