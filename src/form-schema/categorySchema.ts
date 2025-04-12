import { z } from 'zod';

export const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  slug: z
    .string()
    .min(2, {
      message: 'Slug must be at least 2 characters.',
    })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: 'Slug must contain only lowercase letters, numbers, and hyphens',
    }),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  image: z
    .any()
    .refine(
      (file) =>
        !file || // Allow empty value
        (file instanceof File &&
          [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'image/bmp',
            'image/svg+xml',
            'image/tiff',
            'image/jpg',
          ].includes(file.type)),
      {
        message:
          'Image must be a valid file with formats: JPEG, PNG, GIF, WEBP, BMP, SVG, TIFF, or JPG.',
      }
    )
    .optional(),
});
