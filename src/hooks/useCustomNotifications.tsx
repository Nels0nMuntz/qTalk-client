import { toast } from 'react-hot-toast';
import { notify } from '@/lib/utils';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

export const useCustomNotifications = () => {
  const loginNotification = () => {
    notify({
      title: 'Login required.',
      description: 'You need to be logged in to do that.',
      variant: 'error',
      render: (ctx) => (
        <Link
          onClick={() => toast.dismiss(ctx.id)}
          href="/sign-in"
          className={buttonVariants({ variant: 'outline' })}
        >
          Login
        </Link>
      ),
    });
  };

  return { loginNotification };
};
