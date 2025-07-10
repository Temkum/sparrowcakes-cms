import { forwardRef, useEffect, useRef, useState } from 'react';
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
import toast, { Toaster } from 'react-hot-toast';
import { Loader2, Trash } from 'lucide-react';
import Editor from '../Editor';
import ReactQuill from 'react-quill';
import { formSchema } from '@/form-schema/categorySchema';
import useCategoryStore from '@/store/categories-store';
import { CategoryFormModalProps } from '@/types/category';

const QuillEditor = forwardRef<
  ReactQuill,
  {
    value: string;
    onChange: (value: string) => void;
  }
>(({ value, onChange }, ref) => (
  <Editor ref={ref} value={value} onChange={onChange} />
));

const CategoryFormModal = ({
  open,
  onOpenChange,
  onSuccess,
  category,
  mode,
}: CategoryFormModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isImageRemoved, setIsImageRemoved] = useState(false);
  const editorRef = useRef<ReactQuill>(null);
  const { updateCategory, createCategory } = useCategoryStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isActive: false,
      description: '',
      name: '',
      slug: '',
      image: null,
    },
  });

  // Initialize form with category data when in edit mode
  useEffect(() => {
    if (mode === 'edit' && category) {
      form.reset({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        isActive: category.isActive,
        image: null,
      });
      setImagePreview(category.imageUrl || null);
    } else {
      // Reset to defaults for create mode
      form.reset({
        isActive: false,
        description: '',
        name: '',
        slug: '',
        image: null,
      });
      setImagePreview(null);
    }
  }, [category, mode, form]);

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
      isActive: false,
      description: '',
      name: '',
      slug: '',
      image: null,
    });
    setImagePreview(null);
    setIsImageRemoved(false);
  };

  const handleSubmit = async (keepOpen?: boolean) => {
    try {
      setIsSubmitting(true);

      const isValid = await form.trigger();
      if (!isValid) {
        toast.error('Please fix validation errors');
        return;
      }

      const values = form.getValues();

      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('slug', values.slug);
      formData.append('description', values.description || '');
      formData.append('isActive', values.isActive === true ? 'true' : 'false');

      if (mode === 'edit') {
        if (isImageRemoved) {
          formData.append('imageUrl', '');
        } else if (values.image instanceof File) {
          setIsImageRemoved(false);
          formData.append('image', values.image);
        }
      } else if (values.image instanceof File) {
        setIsImageRemoved(false);
        formData.append('image', values.image);
      }

      /*
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      } */

      if (mode === 'edit' && category) {
        await updateCategory(category.id, formData);
      } else {
        await createCategory(formData);
      }

      toast.success(
        `Category ${mode === 'edit' ? 'updated' : 'created'} successfully`
      );
      onSuccess?.();

      if (keepOpen && mode === 'create') {
        resetForm();
      } else {
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(
        `Failed to ${mode === 'edit' ? 'update' : 'create'} category`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Toaster />
      <DialogContent className="sm:max-w-4xl" aria-describedby="Category Form">
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? 'Edit category' : 'Create category'}
          </DialogTitle>
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
                        setIsImageRemoved(true);
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
                  <QuillEditor
                    value={field.value || ''}
                    onChange={field.onChange}
                    ref={editorRef}
                  />
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
                    {mode === 'edit' ? 'Updating...' : 'Creating...'}
                  </>
                ) : mode === 'edit' ? (
                  'Update'
                ) : (
                  'Create'
                )}
              </Button>

              {/* Only show "Create & create another" in create mode */}
              {mode === 'create' && (
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
              )}

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

export default CategoryFormModal;
