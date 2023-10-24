import React from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/constants';
import { getAuthSession } from "@/lib/auth";
import MiniCreatePost from "@/components/MiniCreatePost";

interface Props {
  params: {
    slug: string;
  };
}

export default async function Page({ params }: Props) {
    const session = await getAuthSession()
  const subtalk = await db.subtalk.findFirst({
    where: {
      name: params.slug,
    },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          subtalk: true,
        },
        take: INFINITE_SCROLLING_PAGINATION_RESULTS,
      },
    },
  });

  if (!subtalk) {
    return notFound();
  }

  return (
    <>
      <h1 className="h-14 text-3xl md:text-4xl font-bold">t/{subtalk.name}</h1>
      <MiniCreatePost session={session}/>
    </>
  );
}
