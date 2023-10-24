'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { SignUpFormSchema, signUpFormSchema } from '@/lib/validators';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';
import { useRouter } from 'next/navigation';

export default function SignUpForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const form = useForm<SignUpFormSchema>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: SignUpFormSchema) => {
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/user', {
        method: 'POST',
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.status === 201) {
        toast({ title: data.message, variant: 'default' });
        router.push('/sign-in');
      } else {
        toast({ title: data.message, variant: 'destructive' });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        className="space-y-4 text-left"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input placeholder="the same as above" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="w-full text-white bg-rose-400 rounded-lg hover:bg-rose-500 transition-colors"
          isLoading={isSubmitting}
        >
          Get Started
        </Button>
      </form>
    </Form>
  );
}
