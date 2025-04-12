import { z } from 'zod';

// 1. Define valid image types
const validImageTypes = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/bmp',
  'image/svg+xml',
  'image/tiff',
  'image/jpg',
] as const;

// 2. File validator (for new uploads)
const imageFileValidator = z.custom<File>((file) => {
  if (!(file instanceof File)) return false;
  return validImageTypes.includes(
    file.type as (typeof validImageTypes)[number]
  );
}, 'Please upload a valid image file (JPEG, PNG, GIF, WEBP, BMP, SVG, TIFF, or JPG)');

// export const productFormSchema = z.object({
//   name: z.string().min(2, {
//     message: 'Name must be at least 2 characters.',
//   }),
//   slug: z.string().optional(),
//   description: z.string(),
//   isActive: z.boolean().default(true),
//   availability: z.date(),
//   categories: z
//     .array(z.number())
//     .min(1, { message: 'At least one category is required' }),
//   images: z
//     .union([
//       z
//         .array(z.instanceof(File))
//         .refine((files) => files.length > 0, 'At least one image is required'),
//       z
//         .array(z.string().url())
//         .refine((urls) => urls.length > 0, 'At least one image is required'),
//     ])
//     .refine(
//       (value) => {
//         if (Array.isArray(value)) {
//           return value.length > 0;
//         }
//         return false;
//       },
//       { message: 'At least one image is required' }
//     ),
//   price: z.number().min(1, { message: 'Price is required' }),
//   discount: z.number().min(1, { message: 'Compare at price is required' }),
//   costPerUnit: z.number().min(1, { message: 'Cost per item is required' }),
// });

// Base schema without images
const baseProductSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z.string().optional(),
  description: z.string(),
  isActive: z.boolean().default(true),
  availability: z.date(),
  categories: z.array(z.number()).min(1, 'At least one category is required'),
  price: z.number().min(1, { message: 'Price is required' }),
  discount: z.number().min(1, { message: 'Compare at price is required' }),
  costPerUnit: z.number().min(1, { message: 'Cost per item is required' }),
});

// CREATE schema - only accepts Files
const createProductSchema = baseProductSchema.extend({
  images: z.array(z.instanceof(File)).min(1, 'At least one image is required'),
});

// EDIT schema - accepts both Files (new uploads) and URLs (existing images)
const editProductSchema = baseProductSchema.extend({
  images: z
    .union([
      z.array(z.instanceof(File)).min(1),
      z.array(z.string().url()).min(1),
      z.array(z.union([z.instanceof(File), z.string().url()])).min(1),
    ])
    .refine((val) => val.length > 0, 'At least one image is required'),
});

// Use the appropriate schema based on mode
export const productFormSchema = (mode: 'create' | 'edit') =>
  mode === 'create' ? createProductSchema : editProductSchema;
