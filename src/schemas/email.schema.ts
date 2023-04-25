import { z } from 'zod';

export const EmailSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email address' }),
});

export type EmailFormValues = z.infer<typeof EmailSchema>;
