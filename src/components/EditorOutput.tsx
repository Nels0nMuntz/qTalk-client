'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import CustomImageRenderer from './renderers/CustomImageRenderer';
import CustomCodeRenderer from './renderers/CustomCodeRenderer';

const Output = dynamic(
  async () => (await import('editorjs-react-renderer')).default,
  { ssr: false },
);

const renderers = {
  image: CustomImageRenderer,
  code: CustomCodeRenderer,
};

const style = {
  paragraph: {
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
  },
};

interface Props {
  content: any;
}

export default function EditorOutput({ content }: Props) {
  return (
    <Output
      data={content}
      className="text-sm"
      style={style}
      renderers={renderers}
    />
  );
}
