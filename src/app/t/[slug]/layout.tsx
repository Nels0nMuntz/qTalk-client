import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { buttonVariants } from '@/components/ui/button';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';
import SubscribeToggle from '@/components/SubscribeToggle';

interface Props extends React.PropsWithChildren {
  params: {
    slug: string;
  };
}

export default async function Layout({ params, children }: Props) {
  const session = await getAuthSession();

  const subtalk = await db.subtalk.findFirst({
    where: {
      name: params.slug,
    },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  });

  const subscription = !session?.user
    ? undefined
    : await db.subscription.findFirst({
        where: {
          subtalk: {
            name: params.slug,
          },
          user: {
            id: session.user.id,
          },
        },
      });

  const isSubscribed = Boolean(subscription);

  const memberCount = await db.subscription.count({
    where: {
      subtalk: {
        name: params.slug,
      },
    },
  });

  if (!subtalk) return notFound();

  return (
    <div className="sm:container max-w-7xl mx-auto h-full pt-12">
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
          <ul className="flex flex-col col-span-2 space-y-6">{children}</ul>
          <div className="h-fit rounded-lg border border-gray-200 order-first md:order-last overflow-hidden">
            <div className="px-6 py-4">
              <p className="font-semibold py-3">About r/{subtalk.name}</p>
            </div>
            <div className="px-6 py-4 bg-white">
              <dl className="text-sm leading-6 divide-y divide-gray-100">
                <div className="flex justify-between gap-x-4 py-3">
                  <dt className="text-gray-500">Created</dt>
                  <dd className="text-gray-700">
                    <time dateTime={subtalk.createdAt.toDateString()}>
                      {format(subtalk.createdAt, 'MMMM d, yyyy')}
                    </time>
                  </dd>
                </div>

                <div className="flex justify-between gap-x-4 py-3">
                  <dt className="text-gray-500">Members</dt>
                  <dd className="flex items-start gap-x-2">
                    <div className="text-gray-900">{memberCount}</div>
                  </dd>
                </div>

                {subtalk.creatorId === session?.user?.id ? (
                  <div className="flex justify-between gap-x-4 py-3">
                    <dt className="text-gray-500">
                      You created this community
                    </dt>
                  </div>
                ) : null}

                {subtalk.creatorId !== session?.user?.id ? (
                  <SubscribeToggle
                    isSubscribed={isSubscribed}
                    subtalkId={subtalk.id}
                    subtalkName={subtalk.name}
                  />
                ) : null}
              </dl>
              <Link
                className={buttonVariants({
                  variant: 'outline',
                  className: 'w-full mb-6',
                })}
                href={`t/${params.slug}/submit`}
              >
                Create Post
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
