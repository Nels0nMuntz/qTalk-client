'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import TextareaAutosize from 'react-textarea-autosize';
import type EditorJS from '@editorjs/editorjs';
import { CreatePostPayload, postSchema } from '@/lib/validators';
import { uploadFiles } from '@/lib/uploadthing';
import { notify } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';

interface Props {
  subtalkId: string;
}

export default function Editor({ subtalkId }: Props) {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePostPayload>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      subtalkId: '',
      content: null,
    },
  });

  const router = useRouter();
  const pathname = usePathname();
  const ref = useRef<EditorJS>();
  const _titleRef = useRef<HTMLTextAreaElement | null>();

  const { ref: titleRef, ...titleFieldProps } = register('title');

  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import('@editorjs/editorjs')).default;
    const Header = (await import('@editorjs/header')).default;
    const Embed = (await import('@editorjs/embed')).default;
    const Table = (await import('@editorjs/table')).default;
    const List = (await import('@editorjs/list')).default;
    const Code = (await import('@editorjs/code')).default;
    const LinkTool = (await import('@editorjs/link')).default;
    const InlineCode = (await import('@editorjs/inline-code')).default;
    const ImageTool = (await import('@editorjs/image')).default;

    if (!ref.current) {
      const editor: EditorJS = new EditorJS({
        holder: 'editor',
        onReady: () => {
          ref.current = editor;
          _titleRef?.current?.focus();
        },
        placeholder: 'Type here to write your post...',
        inlineToolbar: true,
        data: { blocks: [] },
        tools: {
          header: Header,
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: '/api/link',
            },
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  const [res] = await uploadFiles({
                    files: [file],
                    endpoint: 'imageUploader',
                  });

                  return {
                    success: 1,
                    file: {
                      url: res.url,
                    },
                  };
                },
              },
            },
          },
          list: List,
          code: Code,
          inlineCode: InlineCode,
          table: Table,
          embed: Embed,
        },
      });
    }
  }, []);

  const { mutate: createPost } = useMutation({
    mutationFn: async (payload: CreatePostPayload) => {
      const { data } = await axios.post('/api/subtalk/post', payload);
      return data;
    },
    onError: () => {
      notify({
        title: 'Something went wrong',
        description: 'Your post was not published, please try again later',
        variant: 'error',
      });
    },
    onSuccess: () => {
      const newPathname = pathname.split('/').slice(0, -1).join('/');
      router.push(newPathname);
      router.refresh();
      return notify({
        title: 'Success!',
        description: 'Your post was published',
        variant: 'success',
      });
    },
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await initializeEditor();
    };

    if (isMounted) {
      init();

      return () => {
        ref.current?.destroy();
        ref.current = undefined;
      };
    }
  }, [isMounted, initializeEditor]);

  useEffect(() => {
    if (Object.keys(errors).length) {
      for (const [key, value] of Object.entries(errors)) {
        notify({
          title: 'Something went wrong',
          description: value.message as string,
          variant: 'error',
        });
      }
    }
  }, [errors]);

  const onSubmit = async (values: CreatePostPayload) => {
    const blocks = await ref.current?.save();
    const payload: CreatePostPayload = {
      title: values.title,
      content: blocks,
      subtalkId,
    };
    createPost(payload);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="w-full p-4 bg-zinc-50 rounded-lg border border-zinc-200">
      <form
        id="subtalk-post-form"
        className="w-fit"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="prose prose-stone dark:prose-invert">
          <TextareaAutosize
            ref={(e) => {
              titleRef(e);
              _titleRef.current = e;
            }}
            {...titleFieldProps}
            placeholder="Title"
            className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
          />
          <div id="editor" className="min-h-[400px]" />
        </div>
      </form>
    </div>
  );
}
