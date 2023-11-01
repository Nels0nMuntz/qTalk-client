'use client';

import React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { SignInFormSchema, signInFormSchema } from '@/lib/validators';
import { Checkbox } from '../ui/checkbox';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { notify } from '@/lib/utils';

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const form = useForm<SignInFormSchema>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (values: SignInFormSchema) => {
    setIsSubmitting(true);

    try {
      const response = await signIn('credentials', {
        ...values,
        redirect: false,
        callbackUrl: searchParams.get('callbackUrl') || '/',
      });

      if (response?.ok) {
        router.push('/');
        router.refresh();
      } else {
        notify({
          title: 'Email or password is invalid',
          variant: 'error',
        });
      }
    } catch (error) {
      notify({
        title: 'There was a problem',
        description: 'There was an error loggong in',
        variant: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 text-left"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="your@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="at least 6 characters" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rememberMe"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 space-y-0">
              <FormControl>
                <Checkbox
                  {...field}
                  value={field.value?.toString()}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="mt-0">Remember Me</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <Link
          href="/forgot-password"
          className="block text-sm font-medium text-center text-orange-600"
        >
          Forgot Password ?
        </Link> */}
        <Button
          className="w-full text-white bg-rose-400 rounded-lg hover:bg-rose-500 transition-colors"
          isLoading={isSubmitting}
        >
          Sign In
        </Button>
      </form>
    </Form>
  );
}
