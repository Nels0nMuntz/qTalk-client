import React from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import Editor from "@/components/Editor";

interface Props {
  params: {
    slug: string;
  };
}

export default async function Page({ params }: Props) {
  const subtalk = await db.subtalk.findFirst({
    where: {
      name: params.slug,
    },
  });

  if (!subtalk) return notFound();

  return (
    <div className="flex flex-col items-start gap-6">
      <div className="border-b border-gray-200 pb-5">
        <div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
          <h3 className="ml-2 mt-2 text-base font-semibold leading-6 text-gray-900">
            Create Post
          </h3>
          <p className="ml-2 mt-1 truncate text-sm text-gray-500">
            in r/{params.slug}
          </p>
        </div>
      </div>
      <Editor subtalkId={subtalk.id}/>
      <div className="w-full flex justify-end">
        <Button type="submit" className="w-full" form="subtalk-post-form">
          Post
        </Button>
      </div>
    </div>
  );
}
