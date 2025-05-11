import { z } from 'zod';

// Regex for international phone numbers including Cameroon
const phoneRegex =
  /^(?:\+?\d{1,3}[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$|^(?:\+237|00237)?(?:6[5-9]\d{7}|2[23]\d{7}|33\d{7})$/;

// Postal code validation patterns by country
const postalCodePatterns = {
  US: /^\d{5}(-\d{4})?$/,
  CA: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
  FR: /^\d{5}$/,
  DE: /^\d{5}$/,
  CM: /^$|^\d{3,5}$/, // Optional for Cameroon, but if provided should be 3-5 digits
} as const;

const customerFormSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: 'Name must be at least 2 characters.' })
      .max(100, { message: 'Name cannot exceed 100 characters.' }),

    email: z
      .string()
      .trim()
      .email({
        message: 'Please enter a valid email address (e.g., user@example.com).',
      })
      .optional()
      .or(z.literal('').transform(() => undefined)),

    phone: z
      .string()
      .min(9, { message: 'Phone number must be at least 9 digits.' })
      .max(20, { message: 'Phone number cannot exceed 20 characters.' })
      .regex(phoneRegex, {
        message:
          'Please enter a valid phone number (e.g., +1 (234) 567-8901 or +237675827455).',
      }),

    city: z
      .string()
      .max(100, { message: 'City cannot exceed 100 characters.' })
      .optional(),
    address: z
      .string()
      .max(200, { message: 'Address cannot exceed 200 characters.' })
      .optional(),
    occupation: z
      .string()
      .max(100, { message: 'Occupation cannot exceed 100 characters.' })
      .optional(),
    country: z
      .string()
      .refine(
        (value) => !value || ['US', 'CA', 'CM', 'FR', 'DE'].includes(value),
        {
          message: 'Please select a valid country from the dropdown.',
        }
      )
      .optional(),
    state: z
      .string()
      .max(100, { message: 'State cannot exceed 100 characters.' })
      .optional(),
    postal_code: z.string().optional(),
    image_url: z
      .string()
      .optional()
      .or(z.literal('').transform(() => undefined)),
  })
  .refine(
    (data) => {
      // If no postal code or country is provided, that's fine
      if (!data.postal_code || !data.country) return true;

      // Get the pattern for the selected country
      const pattern =
        postalCodePatterns[data.country as keyof typeof postalCodePatterns];

      // Test the postal code against the country-specific pattern
      return pattern.test(data.postal_code);
    },
    (data) => ({
      message: data.country
        ? getPostalCodeErrorMessage(data.country)
        : 'Invalid postal code format',
      path: ['postal_code'],
    })
  );

function getPostalCodeErrorMessage(country: string): string {
  switch (country) {
    case 'US':
      return 'US postal code must be in format: 12345 or 12345-6789';
    case 'CA':
      return 'Canadian postal code must be in format: A1A 1A1';
    case 'FR':
      return 'French postal code must be 5 digits';
    case 'DE':
      return 'German postal code must be 5 digits';
    case 'CM':
      return 'Cameroon postal code must be 3-5 digits if provided';
    default:
      return 'Invalid postal code format';
  }
}

export default customerFormSchema;
