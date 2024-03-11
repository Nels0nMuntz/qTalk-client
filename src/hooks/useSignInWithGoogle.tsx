import React from 'react';
import { signIn } from 'next-auth/react';
import { notify } from '@/lib/utils';

export default function useSignInWithGoogle() {
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
  return { isLoading, signInWithGoogle };
}
