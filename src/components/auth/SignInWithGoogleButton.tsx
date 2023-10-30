'use client';

import React from 'react';
import { signIn } from 'next-auth/react';
import { Icons } from '../Icons';
import { Button } from '../ui/button';
import { notify } from '@/lib/utils';

export default function SignInWithGoogleButton() {
  const [isLoading, setIsLoading] = React.useState(false);

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      const response = await signIn('google', { callbackUrl: '/' });
      console.log({ response });
    } catch (error) {
      console.log(error);
      notify({
        variant: 'error',
        title: 'There was a problem',
        description: 'There was an error loggong in with Google',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      size="sm"
      className="w-full"
      isLoading={isLoading}
      onClick={signInWithGoogle}
      type="button"
    >
      {!isLoading && <Icons.google className="w-4 h-4 mr-2" />}
      Continue with Google
    </Button>
  );
}
