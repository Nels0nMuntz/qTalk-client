import React from 'react';
import { User } from "next-auth";
import { AvatarProps } from "@radix-ui/react-avatar";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Icons } from "./Icons";


interface Props extends AvatarProps {
    user?: Pick<User, 'name' | 'email' | 'image'>;
}

export default function UserAvatar({ user, ...avatarProps }: Props) {
  return (
    <Avatar {...avatarProps}>
      <AvatarImage src={user?.image || undefined} alt="avatar" referrerPolicy="no-referrer" />
      <AvatarFallback>
        <Icons.user className="w-4 h-4"/>
        <span className="sr-only">{user?.name}</span>
      </AvatarFallback>
    </Avatar>
  );
}
