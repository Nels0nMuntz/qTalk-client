import toast, { ToastOptions, Toast } from 'react-hot-toast';
import { CheckCircle, XCircle, X } from 'lucide-react';
import React from 'react';

type NotifyVariants = 'success' | 'error';

const icons: Record<NotifyVariants, JSX.Element> = {
  success: <CheckCircle color="#a3e635" />,
  error: <XCircle color="#f87171" />,
};

export const notify = ({
  title,
  description,
  render,
  variant,
  options,
}: {
  title?: string;
  description?: string;
  render?: (ctx: Toast) => React.ReactNode;
  variant: 'success' | 'error';
  options?: ToastOptions;
}) => {
  const Icon = icons[variant];
  return toast(
    (t) => (
      <div className="flex items-start">
        <div className="shrink-0 mr-4">{Icon}</div>
        <div className="flex flex-col gap-y-1">
          <span className="text-sm font-semibold">{title}</span>
          <span className="text-sm" onClick={() => toast.dismiss(t.id)}>
            {description}
          </span>
          {render && render(t)}
        </div>
        <div className="ml-4 shrink-0">
          <button
            className="text-zinc-500 hover:text-zinc-700 transition-all rounded-md focus:outline focus:outline-offset-1 focus:outline-2 focus:outline-indigo-500"
            type="button"
            onClick={() => toast.dismiss(t.id)}
          >
            <span className="sr-only">Close</span>
            <X size={20} />
          </button>
        </div>
      </div>
    ),
    options,
  );
};
