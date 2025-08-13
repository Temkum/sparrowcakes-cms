import { z } from 'zod';

// Base schema for common fields
const baseProductSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(255, 'Name must be less than 255 characters'),
  slug: z.string().max(255, 'Slug must be less than 255 characters').optional(),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  availableFrom: z
    .date()
    .refine((date) => date >= new Date(new Date().setHours(0, 0, 0, 0)), {
      message: 'Available from date must be today or in the future',
    }),
  availableTo: z
    .date()
    .nullable()
    .optional()
    .refine(
      (date) => !date || date > new Date(new Date().setHours(0, 0, 0, 0)),
      {
        message: 'Available to date must be in the future',
      }
    ),
  categories: z
    .array(z.number())
    .min(1, { message: 'At least one category is required' }),
  price: z
    .number()
    .min(0, { message: 'Price must be non-negative' })
    .max(1000000, { message: 'Price is too high' }),
  discount: z
    .number()
    .min(0, { message: 'Discount must be non-negative' })
    .max(1000000, { message: 'Discount is too high' })
    .default(0),
  costPerUnit: z
    .number()
    .min(0, { message: 'Cost per unit must be non-negative' })
    .max(1000000, { message: 'Cost per unit is too high' })
    .default(0),
  quantity: z.coerce
    .number()
    .int()
    .min(0, { message: 'Quantity must be non-negative' })
    .max(1000000, { message: 'Quantity is too high' })
    .default(0),
});

// CREATE schema - only accepts Files for images
const createProductSchema = baseProductSchema.extend({
  images: z
    .array(z.instanceof(File))
    .min(1, 'At least one image is required')
    .max(10, 'Maximum 10 images allowed'),
});

// EDIT schema - accepts both Files (new uploads) and URLs (existing images)
const editProductSchema = baseProductSchema.extend({
  images: z
    .array(z.union([z.instanceof(File), z.string().url()]))
    .min(1, 'At least one image is required')
    .max(10, 'Maximum 10 images allowed'),
});

// Use the appropriate schema based on mode
export const productFormSchema = (mode: 'create' | 'edit') =>
  mode === 'create' ? createProductSchema : editProductSchema;
