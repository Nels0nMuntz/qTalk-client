'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useEditorContext } from '@/providers';

export default function SubmitPostButton() {
  const { isSubmitting } = useEditorContext();
  return (
    <Button
      type="submit"
      className="w-full"
      form="subtalk-post-form"
      isLoading={isSubmitting}
    >
      Post
    </Button>
  );
}
