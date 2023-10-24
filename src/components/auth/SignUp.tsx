import React from 'react';
import Link from 'next/link';
import { Icons } from '../Icons';
import SignUpForm from "./SignUpForm";
import SignInWithGoogleButton from "./SignInWithGoogleButton";
import { Separator } from "../ui/separator";

export default function SignUp() {
  return (
    <div className="container w-full sw:w-[400px] mx-auto flex flex-col justify-center space-y-6">
      <div className="w-full max-w-xs mx-auto flex flex-col space-y-4 text-center">
        <Icons.logo className="h-6 w-6 mx-auto" />
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm mx-auto mb-4">
          By continuing, you are setting up a qTalk account and agree to our
          User Agreement and Privacy Policy
        </p>

        <SignInWithGoogleButton/>

        <div className="relative w-full text-center">
          <span className="relative inline-block px-3 text-sm text-zinc-500 uppercase bg-white z-[1]">or continue with</span>
          <Separator className="absolute top-1/2 left-0 right-0" />
        </div>

        <SignUpForm/>

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
