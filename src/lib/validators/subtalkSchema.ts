import { z } from 'zod';

export const createSubtalkSchema = z.object({
  name: z
    .string()
    .min(2)
    .max(22)
    .regex(/^[a-zA-Z0-9_.-]*$/),
});

export const subtalkSubscriptionSchema = z.object({
  subtalkId: z.string(),
});

export type CreateSubtalkPayload = z.infer<typeof createSubtalkSchema>;
export type SubscribeToSubtalkPayload = z.infer<
  typeof subtalkSubscriptionSchema
>;
