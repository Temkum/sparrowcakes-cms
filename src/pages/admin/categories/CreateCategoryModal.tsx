import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Editor } from '../Editor';
import axios from 'axios';
import { useAuthStore } from '@/store/auth';
import toast, { Toaster } from 'react-hot-toast';
import { Loader2, Trash } from 'lucide-react';

const formSchema = z.object({
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

interface CreateCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const CreateCategoryModal = ({
  open,
  onOpenChange,
  onSuccess,
}: CreateCategoryModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useAuthStore();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isActive: true,
      description: '',
      name: '',
      slug: '',
      image: null,
    },
  });

  // Clear preview when component unmounts or when image changes
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (optional, adjust as needed)
      const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSizeInBytes) {
        toast.error('File is too large. Maximum size is 10MB.');
        return;
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);

      // Clean up previous preview if exists
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }

      // Set new preview and form value
      setImagePreview(previewUrl);
      form.setValue('image', file);
    }
  };

  const resetForm = () => {
    form.reset({
      isActive: true,
      description: '',
      name: '',
      slug: '',
      image: null,
    });
    setImagePreview(null);
  };

  const handleSubmit = async (keepOpen?: boolean) => {
    try {
      setIsSubmitting(true);

      // const formData = new FormData();
      const values = form.getValues();
      console.log('Form Values:', values);

      if (values.description) {
        values.description = values.description?.replace(/<p>|<\/p>/g, '');
      }

      const response = await axios.post(
        'http://localhost:5000/categories',
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log(response.data);

      toast.success('Category created successfully');
      onSuccess?.();

      if (keepOpen) {
        resetForm(); // Clear fields but keep modal open
      } else {
        onOpenChange(false); // Close modal
        resetForm();
      }

      onSuccess?.();
    } catch (error) {
      toast.error('Something went wrong. Failed to create category!');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Toaster />
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Create category</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(() => handleSubmit(false))}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-4 w-full">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          form.setValue('slug', generateSlug(e.target.value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ''} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="image"
                  render={() => (
                    <FormItem className="col-span-2">
                      <FormLabel>Image Upload</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/jpeg,image/png,image/gif,image/webp,image/bmp,image/svg+xml,image/tiff,image/jpg"
                          onChange={handleImageChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {imagePreview && (
                  <div className="mt-4">
                    <img
                      src={imagePreview}
                      alt="Category Preview"
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      className="mt-2 flex items-center text-red-500 hover:text-red-600"
                      onClick={() => {
                        setImagePreview(null);
                        form.setValue('image', null);
                      }}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <Editor value={field.value || ''} onChange={field.onChange} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center rounded-lg pt-7 align-center">
                  <div className="space-y-0.5 mr-3 pl-0">
                    <FormLabel className="text-base">
                      Visible to customers
                    </FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-orange-500"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create'
                )}
              </Button>
              <Button
                type="submit"
                variant="outline"
                onClick={form.handleSubmit(() => handleSubmit(true))}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create & create another'
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCategoryModal;
