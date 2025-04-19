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

// Base schema without images
const baseProductSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z.string(),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  availability: z.date(),
  categories: z
    .array(z.number())
    .min(1, { message: 'At least one category is required' }),
  price: z.number().min(1, { message: 'Price is required' }),
  discount: z.number().min(1, { message: 'Compare at price is required' }),
  costPerUnit: z.number().min(1, { message: 'Cost per item is required' }),
  quantity: z.coerce
    .number()
    .min(1, { message: 'Quantity is required' })
    .default(1),
});

export const productFormSchema0 = (mode: 'create' | 'edit') =>
  z.object({
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required'),
    description: z.string().optional(),
    price: z.number().min(0, 'Price must be a positive number'),
    discount: z.number().min(0, 'Discount must be a positive number'),
    costPerUnit: z.number().min(0, 'Cost per unit must be a positive number'),
    quantity: z.number().min(0, 'Quantity must be a positive number'),
    isActive: z.boolean().default(true),
    availability: z.date(),
    categories: z
      .array(
        z.union([
          z.number(), // For ID values
          z.object({
            // For category objects
            id: z.number(),
            name: z.string().optional(),
          }),
        ])
      )
      .min(1, 'At least one category is required'),
    images:
      mode === 'create'
        ? z.array(z.instanceof(File)).min(1, 'At least one image is required')
        : z.array(z.union([z.string(), z.instanceof(File)])),
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
