'use client';

import { Icons } from '../Icons';
import { Button } from '../ui/button';
import useSignInWithGoogle from "@/hooks/useSignInWithGoogle";

export default function SignInWithGoogleButton() {
  const { isLoading, signInWithGoogle } = useSignInWithGoogle();

  return (
    <Button
      size="sm"
      className="w-full"
      isLoading={isLoading}
      onClick={signInWithGoogle}
      type="button"
    >
      {!isLoading && <Icons.google className="w-4 h-4 mr-2" data-testid="google-icon" />}
      Continue with Google
    </Button>
  );
}
