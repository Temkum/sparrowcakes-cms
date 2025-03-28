import { useState } from 'react';
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
  imageUrl: z.string().optional(),
});

interface CreateCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateCategoryModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateCategoryModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useAuthStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isActive: true,
      description: '',
      name: '',
      slug: '',
      imageUrl: '',
    },
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(token);
    try {
      setIsSubmitting(true);

      // Sanitize description by removing HTML tags
      const sanitizedValues = {
        ...values,
        description: (values?.description || '').replace(/<\/?p>/g, '').trim(),
      };

      // Extensive logging for debugging
      console.group('Category Creation Debug');
      console.log('Token:', token);
      console.log('Token Length:', token?.length);
      console.log('Token First 10 chars:', token?.substring(0, 10));
      console.log('Full Request Payload:', sanitizedValues);

      // return;

      const response = await axios.post(
        'http://localhost:5000/categories',
        sanitizedValues,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Response:', response);
      console.groupEnd();

      toast.success('Category created successfully');

      form.reset();
      onSuccess?.();
      onOpenChange(false);
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Image Upload</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                field.onChange(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.watch('imageUrl') && (
                  <img
                    src={form.watch('imageUrl')}
                    alt="Uploaded"
                    className="mt-4 w-full h-32 object-cover rounded-lg"
                  />
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
                Create
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Create & create another
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
