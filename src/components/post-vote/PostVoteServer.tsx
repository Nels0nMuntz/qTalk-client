import React from 'react';
import { notFound } from 'next/navigation';
import { Post, Vote, VoteType } from '@prisma/client';
import { getAuthSession } from '@/lib/auth';
import PostVoteClient from './PostVoteClient';

interface Props {
  postId: string;
  initialVotesCount?: number;
  initialVote?: Vote['type'] | null;
  getData?: () => Promise<(Post & { votes: Vote[] }) | null>;
}

export default async function PostVoteServer({
  postId,
  initialVote,
  initialVotesCount,
  getData,
}: Props) {
  const session = await getAuthSession();
  let votesCount = 0;
  let currentVote: VoteType | null = null;
  if (getData) {
    const post = await getData();

    if (!post) return notFound();

    votesCount = post.votes.reduce((prev, curr) => {
      if (curr.type === 'UP') return prev + 1;
      if (curr.type === 'DOWN') return prev - 1;
      return prev;
    }, 0);

    currentVote =
      post.votes.find(({ userId }) => userId === session?.user.id)?.type ||
      null;
  } else {
    votesCount = initialVotesCount!;
    currentVote = initialVote || null;
  }

  return (
    <PostVoteClient
      postId={postId}
      initialVote={currentVote}
      initialVoteCount={votesCount}
    />
  );
}
