'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { signIn } from 'next-auth/react';
import { Icons } from '../Icons';
import { Button } from '../ui/button';

export default function SignInWithGoogleButton() {
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl });
    } catch (error) {
      toast({
        title: 'There was a problem',
        description: 'There was an error loggong in with Google',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      size="sm"
      className="w-full"
      onClick={signInWithGoogle}
    >
      {!isLoading && <Icons.google className="w-4 h-4 mr-2" />}
      Continue with Google
    </Button>
  );
}
