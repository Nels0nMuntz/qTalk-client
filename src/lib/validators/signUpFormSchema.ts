import * as z from 'zod';

export const signUpFormSchema = z
  .object({
    username: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(6).max(20),
    confirmPassword: z.string(),
  })
  .refine(
    ({ password, confirmPassword }) => {
      return password === confirmPassword;
    },
    {
      message: 'Passwords must match!',
      path: ['confirmPassword'],
    },
  );

export type SignUpFormSchema = z.infer<typeof signUpFormSchema>;
