import Link from 'next/link';
import React from 'react';
import { getServerSession } from 'next-auth';
import { Icons } from '../Icons';
import { buttonVariants } from '../ui/button';
import UserAccountNavbar from './UserAccountNavbar';
import { authoOptions } from '@/lib/auth';
import Searchbar from './Searchbar';

export default async function Navbar() {
  const session = await getServerSession(authoOptions);

  return (
    <header className="fixed top-0 inset-x-0 h-auto bg-zinc-100 border-b border-zinc-300 z-10 py-2">
      <div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2">
        <Link href="/" className="flex gap-2 items-center">
          <Icons.logo className="w-8 h-8 sm:w-6 sm:h-6" />
          <span className="hidden md:block text-zinc-700 text-sm font-medium">
            qTalk
          </span>
        </Link>
        {session?.user && <Searchbar />}
        {session?.user ? (
          <UserAccountNavbar user={session.user} />
        ) : (
          <Link href="/sign-in" className={buttonVariants()}>
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
