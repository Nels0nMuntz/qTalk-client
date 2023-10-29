'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { User } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  SettingsPayload,
  settingsSchema,
} from '@/lib/validators/settingsSchema';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { notify } from '@/lib/utils';

interface Props {
  user: Pick<User, 'id' | 'username'>;
}

export default function SettingsForm({ user }: Props) {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<SettingsPayload>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: user.username || '',
    },
  });

  const { mutate: update, isPending } = useMutation({
    mutationFn: async (values: SettingsPayload) => {
      const { data } = await axios.patch('/api/settings', values);
      return data;
    },
    onSuccess: () => {
      notify({
        variant: 'success',
        title: 'Your username has been updated.',
      });
      router.refresh();
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          return notify({
            variant: 'error',
            title: 'Username already taken.',
            description: 'Please choose another username.',
          });
        }
      }
      return notify({
        variant: 'error',
        title: 'Something went wrong.',
        description: 'Your username was not updated. Please try again.',
      });
    },
  });

  return (
    <form onSubmit={handleSubmit((values) => update(values))}>
      <Card>
        <CardHeader>
          <CardTitle>Your username</CardTitle>
          <CardDescription>
            Please enter a display name you are comfortable with.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative grid gap-1">
            <div className="absolute top-0 left-0 w-8 h-10 grid place-items-center">
              <span className="text-sm text-zinc-400">u/</span>
            </div>
            <Label className="sr-only" htmlFor="name">
              Name
            </Label>
            <Input
              id="name"
              className="w-[400px] pl-6"
              size={32}
              {...register('name')}
            />
            {errors?.name && (
              <p className="px-1 text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button isLoading={isPending}>Update</Button>
        </CardFooter>
      </Card>
    </form>
  );
}
