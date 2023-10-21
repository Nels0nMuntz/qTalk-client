import * as z from 'zod';

export const signInFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(20),
  rememberMe: z.boolean(),
});

export type SignInFormSchema = z.infer<typeof signInFormSchema>;
