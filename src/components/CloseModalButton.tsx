'use client';

import React from 'react';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CloseModalButton() {
  const router = useRouter();
  return (
    <Button
      className="w-6 h-6 p-0 rounded-md"
      variant="ghost"
      aria-label="close modal"
      onClick={() => router.back()}
    >
      <X className="w-4 h-4" />
    </Button>
  );
}
