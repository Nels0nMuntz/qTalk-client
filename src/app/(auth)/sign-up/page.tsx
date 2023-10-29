import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import SignUp from '@/components/auth/SignUp';

export default function Page() {
  return (
    <div className="absolute inset-0">
      <div className="max-w-2xl h-full mx-auto flex flex-col items-center justify-center gap-20">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'self-start -mt-20',
          )}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Home
        </Link>
        <SignUp />
      </div>
    </div>
  );
}
