import { z } from 'zod';

export const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name cannot be empty.',
  }),
  slug: z
    .string()
    .min(2, {
      message: 'Slug is required',
    })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: 'Slug must contain only lowercase letters, numbers, and hyphens',
    }),
  description: z.string().optional(),
  isActive: z.boolean(),
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
