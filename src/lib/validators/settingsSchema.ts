import { z } from 'zod';

export const settingsSchema = z.object({
  name: z
    .string()
    .min(2)
    .max(36)
    .regex(/^[a-zA-Z0-9_\.]+$/),
});

export type SettingsPayload = z.infer<typeof settingsSchema>;
