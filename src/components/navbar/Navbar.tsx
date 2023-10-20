import Link from 'next/link';
import React from 'react';
import { Icons } from '../Icons';
import { buttonVariants } from '../ui/button';
import { getAuthSession } from '@/lib/auth';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import UserAvatar from './UserAvatar';
import UserAccountNavbar from './UserAccountNavbar';
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@radix-ui/react-dropdown-menu';

export default async function Navbar() {
  const session = await getAuthSession();
  const user = session?.user;
  return (
    <div className="fixed top-0 inset-x-0 h-fit bg-zinc-100 border-b border-zinc-300 z-10 py-2">
      <div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2">
        <Link href="/" className="flex gap-2 items-center">
          <Icons.logo className="w-8 h-8 sm:w-6 sm:h-6" />
          <span className="hidden md:block text-zinc-700 text-sm font-medium">
            qTalk
          </span>
        </Link>
        {user ? (
          <UserAccountNavbar user={user} />
        ) : (
          // <DropdownMenu>
          //   <DropdownMenuTrigger>
          //     <UserAvatar user={user} className="w-8 h-8" />
          //   </DropdownMenuTrigger>
          //   <DropdownMenuContent>
          //     <div className="flex items-center justify-start gap-2 p-2">
          //       <div className="flex flex-col space-y-1 leading-none">
          //         {user?.name && <p className="font-medium">{user.name}</p>}
          //         {user?.email && (
          //           <p className="w-[200px] text-sm text-zinc-700 truncate">
          //             {user.email}
          //           </p>
          //         )}
          //       </div>
          //     </div>

          //     <DropdownMenuSeparator />

          //     <DropdownMenuItem asChild>
          //       <Link href="/">Feed</Link>
          //     </DropdownMenuItem>
          //     <DropdownMenuItem asChild>
          //       <Link href="/r/create">Create Community</Link>
          //     </DropdownMenuItem>
          //     <DropdownMenuItem asChild>
          //       <Link href="/settings">Settings</Link>
          //     </DropdownMenuItem>

          //     <DropdownMenuSeparator />

          //     <DropdownMenuItem className="cursor-pointer">Sign out</DropdownMenuItem>
          //   </DropdownMenuContent>
          // </DropdownMenu>
          <Link href="/sign-in" className={buttonVariants()}>
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
}
