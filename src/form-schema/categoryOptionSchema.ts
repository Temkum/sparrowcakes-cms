import { z } from 'zod';

export const categoryOptionSchema = z.object({
  id: z.number(),
  name: z.string(),
});
