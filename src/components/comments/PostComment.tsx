'use client';

import React, { useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from "axios";
import { Comment, CommentVote, User } from '@prisma/client';
import { MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import UserAvatar from '../UserAvatar';
import { formatTimeToNow, notify } from '@/lib/utils';
import CommentVotes from './CommentVotes';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { useMutation } from "@tanstack/react-query";
import { CreateCommentPayload } from "@/lib/validators/commentSchema";
import { useOnClickOutside } from "@/hooks";

type ExtendedComment = Comment & {
  votes: CommentVote[];
  author: User;
};

interface Props {
  comment: ExtendedComment;
  votesCount: number;
  currentVote: CommentVote | null;
  postId: string;
}

export default function PostComment({
  comment,
  currentVote,
  votesCount,
  postId,
}: Props) {
  const router = useRouter();
  const [replying, setIsReplying] = useState(false);
  const [value, setValue] = useState('');
  const commentRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  useOnClickOutside(commentRef, () => {
    setIsReplying(false)
  })
  const handleReply = () => {
    if (!session) {
      return router.push('/sign-in');
    }
    setIsReplying(true);
  };
  const { mutate: postComment, isPending } = useMutation({
    mutationFn: async (payload: CreateCommentPayload) => {
      const {data} = await axios.post('/api/subtalk/post/comment', payload)
      return data
    },
    onSuccess: () => {
      setIsReplying(false)
      setValue('')
      router.refresh()
    },
    onError: () => {
      return notify({
        variant: 'error',
        title: 'Something went wrong.',
        description: "Comment wasn't created successfully. Please try again.",
      })
    }
  });
  const handlePostComment = () => {
    postComment({
      text: value,
      postId,
      replyToId: comment.replyToId ?? comment.id
    })
  }
  const handleCancelComment = () => {
    setIsReplying(false)
    setValue('')
  }
  return (
    <div ref={commentRef} className="flex flex-col">
      <div className="flex items-center">
        <UserAvatar
          user={{
            name: comment.author.name || null,
            image: comment.author.image || null,
          }}
          className="h-6 w-6"
        />
        <div className="ml-2 flex items-center gap-x-2">
          <p className="text-sm font-medium text-gray-900">
            u/{comment.author.username}
          </p>

          <p className="max-h-40 truncate text-xs text-zinc-500">
            {formatTimeToNow(new Date(comment.createdAt))}
          </p>
        </div>
      </div>
      <p className="text-sm text-zinc-900 mt-2">{comment.text}</p>
      <div className="flex gap-2 items-center flex-wrap">
        <CommentVotes
          commentId={comment.id}
          initialVote={currentVote}
          initialVotesCount={votesCount}
        />
        <Button size="xs" variant="ghost" onClick={handleReply}>
          <MessageSquare className="w-4 h-4 mr-1.5" />
          Reply
        </Button>
        {replying ? (
          <div className="grid w-full gap-1.5">
            <Label htmlFor="comment">Your comment</Label>
            <div className="mt-2">
              <Textarea
                onFocus={(e) =>
                  e.currentTarget.setSelectionRange(
                    e.currentTarget.value.length,
                    e.currentTarget.value.length,
                  )
                }
                autoFocus
                id="comment"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                rows={1}
                placeholder="What are your thoughts?"
              />

              <div className="mt-2 flex justify-end gap-2">
                <Button
                  tabIndex={-1}
                  variant="outline"
                  onClick={handleCancelComment}
                >
                  Cancel
                </Button>
                <Button
                  isLoading={isPending}
                  disabled={!value.length}
                  onClick={handlePostComment}
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
