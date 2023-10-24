'use client';

import React from 'react';
import { useToast } from '@/components/ui/use-toast';
import { signIn } from 'next-auth/react';
import { Icons } from '../Icons';
import { Button } from '../ui/button';

export default function SignInWithGoogleButton() {
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      const response = await signIn('google', { callbackUrl : "http://localhost:3000"});
      console.log({response});
    
    } catch (error) {
      console.log(error);      
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
      isLoading={isLoading}
      onClick={signInWithGoogle}
      type="button"
    >
      {!isLoading && <Icons.google className="w-4 h-4 mr-2" />}
      Continue with Google
    </Button>
  );
}
