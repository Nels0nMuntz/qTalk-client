import React from 'react';
import Link from 'next/link';
import { Icons } from '../Icons';
import UserAuthForm from "./SignInForm";

export default function SignUp() {
  return (
    <div className="container w-full sw:w-[400px] mx-auto flex flex-col justify-center space-y-6">
      <div className="flex flex-col space-y-2 text-center">
        <Icons.logo className="h-6 w-6 mx-auto" />
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="max-w-xs text-sm mx-auto mb-4">
          By continuing, you are setting up a qTalk account and agree to our
          User Agreement and Privacy Policy
        </p>
        <UserAuthForm/>
        <p className="px-8 pt-4 text-center text-sm text-zinc-700">
          Already have an account?{' '}
          <Link
            href="/sign-in"
            className="text-sm underline underline-offset-4 hover:text-zinc-800"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
