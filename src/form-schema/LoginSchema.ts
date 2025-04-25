import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().nonempty('Email is required').email('Invalid email'),
  password: z
    .string()
    .nonempty('Password is required')
    .min(6, 'Password must be at least 6 characters long'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export { loginSchema };
export type { LoginFormData };
