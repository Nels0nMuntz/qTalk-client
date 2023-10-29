import Link from 'next/link';
import { HomeIcon } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { getAuthSession } from '@/lib/auth';
import GeneralFeed from '@/components/GeneralFeed';
import CustomFeed from '@/components/CustomFeed';

export default async function Home() {
  const session = await getAuthSession();
  return (
    <>
      <h1 className="text-3xl md:text-4xl font-bold">Your feed</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
        {session ? <CustomFeed /> : <GeneralFeed />}
        <div className="h-fit border border-gray-200 overflow-hidden rounded-lg order-first md:order-last">
          <div className="px-6 py-4 bg-emerald-100">
            <p className="py-3 flex items-center g-1.5 font-semibold">
              <HomeIcon className="w-4 h-4 mr-2" />
              Home
            </p>
          </div>

          <div className="-my-3 px-6 py-4 divide-y divide-gray-100 text-sm leading-6">
            <div className="flex justify-between gap-x-4 py-3">
              <p className="text-zinc-500">
                Your personal <strong>qTalk</strong> frontpage. Come here to
                check in with your favorite communities.
              </p>
            </div>
            <Link
              className={buttonVariants({
                className: 'w-full mt-4 mb-6',
              })}
              href={`/t/create`}
            >
              Create Community
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
