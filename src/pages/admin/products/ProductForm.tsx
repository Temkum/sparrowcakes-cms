import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import Editor from '../Editor';
import { DynamicCategories } from '../categories/DynamicCategories';
import { useNavigate } from 'react-router-dom';
import { productFormSchema } from '@/form-schema/productFormSchema';
import { ImageUpload } from './ImageUpload';
import useProductStore from '@/store/product-store';
import { useAuthStore } from '@/store/auth';

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  discount: number;
  costPerUnit: number;
  isActive: boolean;
  availability: Date;
  category: number;
  images: string[];
}

interface ProductFormProps {
  product?: Product;
  onSuccess?: () => void;
  mode: 'create' | 'edit';
}

const ProductForm = ({ product, onSuccess, mode }: ProductFormProps) => {
  const navigate = useNavigate();
  const [isImagesOpen, setIsImagesOpen] = useState(true);
  const [isPricingOpen, setIsPricingOpen] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  // Zustand store
  const {
    submitting,
    validationErrors,
    createProduct,
    updateProduct,
    deleteProduct,
    clearValidationErrors,
  } = useProductStore();

  const form = useForm<z.infer<ReturnType<typeof productFormSchema>>>({
    resolver: zodResolver(productFormSchema(mode)),
    defaultValues: {
      name: product?.name || '',
      slug: product?.slug || '',
      description: product?.description || '',
      price: product?.price || 0,
      discount: product?.discount || 0,
      costPerUnit: product?.costPerUnit || 0,
      isActive: product?.isActive ?? true,
      availability: product?.availability || new Date(),
      category: undefined,
      images: product?.images || [],
    },
  });

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  // Handle form submission
  const onSubmit = async (
    values: z.infer<ReturnType<typeof productFormSchema>>
  ) => {
    clearValidationErrors();

    try {
      const formData = new FormData();

      // Append all non-file fields
      Object.entries(values).forEach(([key, value]) => {
        if (key !== 'images') {
          if (
            typeof value === 'object' &&
            !(value instanceof File) &&
            !(value instanceof Date)
          ) {
            formData.append(key, JSON.stringify(value));
          } else if (value instanceof Date) {
            formData.append(key, value.toISOString());
          } else {
            formData.append(key, String(value));
          }
        }
      });

      // Handle images
      if (mode === 'create') {
        (values.images as File[]).forEach((file) => {
          formData.append('images', file);
        });
      } else {
        const existingUrls = (values.images as (string | File)[]).filter(
          (img) => typeof img === 'string'
        );
        const newFiles = (values.images as (string | File)[]).filter(
          (img) => img instanceof File
        ) as File[];

        formData.append('existingImages', JSON.stringify(existingUrls));
        newFiles.forEach((file) => {
          formData.append('newImages', file);
        });
      }

      let result;
      // get token from zustand store
      const { token } = useAuthStore.getState();
      if (!token) {
        toast.error('Token not found');
        return;
      }
      if (mode === 'create') {
        result = await createProduct(formData, token);
        toast.success('Product created successfully');
      } else if (product) {
        result = await updateProduct(product.id, formData, token);
        toast.success('Product updated successfully');
      }

      if (result && onSuccess) {
        onSuccess();
      } else if (result) {
        navigate('/products');
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to save product');
    }
  };

  // Handle creating another product
  function handleCreateAnother() {
    form.reset({
      name: '',
      slug: '',
      description: '',
      price: 0,
      discount: 0,
      costPerUnit: 0,
      isActive: true,
      availability: new Date(),
      category: 0,
      images: [],
    });
    toast.success('Ready to create another product');
  }

  // Handle product deletion
  const handleDelete = async () => {
    if (!product) return;

    setIsDeleting(true);
    try {
      const result = await deleteProduct(product.id);
      if (result) {
        toast.success('Product deleted successfully');
        if (onSuccess) {
          onSuccess();
        } else {
          navigate('/products');
        }
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    } finally {
      setIsDeleting(false);
    }
  };

  // Set validation errors from API on form fields
  useEffect(() => {
    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => {
        console.error('Validation error:', error);
        const fieldName = error.field.toLowerCase() as any;
        form.setError(fieldName, {
          type: 'server',
          message: error.message,
        });
      });
    }
  }, [validationErrors, form]);

  return (
    <>
      <Toaster />
      <FormProvider {...form}>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Form */}
          <Form {...form}>
            <div className="w-full">
              <Card className="space-y-8 p-4 bg-white shadow-sm border border-gray-200">
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="space-y-8">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Name<span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e);
                                    form.setValue(
                                      'slug',
                                      generateSlug(e.target.value)
                                    );
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
                            <FormItem>
                              <FormLabel>Slug</FormLabel>
                              <FormControl>
                                <Input {...field} readOnly />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Editor
                                value={field.value}
                                onChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Images */}
                    <div className="space-y-4">
                      <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => setIsImagesOpen(!isImagesOpen)}
                      >
                        <h2 className="text-lg font-semibold mt-5">Images</h2>
                        {isImagesOpen ? <ChevronUp /> : <ChevronDown />}
                      </div>
                      {isImagesOpen && (
                        <FormField
                          control={form.control}
                          name="images"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Product Images</FormLabel>
                              <FormControl>
                                <ImageUpload
                                  value={field.value || []}
                                  onChange={(images) => {
                                    field.onChange(images);
                                    form.trigger('images');
                                  }}
                                  maxFiles={10}
                                  isEditMode={mode === 'edit'}
                                  disabled={submitting}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>

                    {/* Pricing */}
                    <div className="space-y-4">
                      <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => setIsPricingOpen(!isPricingOpen)}
                      >
                        <h2 className="text-lg font-semibold mt-5">Pricing</h2>
                        {isPricingOpen ? <ChevronUp /> : <ChevronDown />}
                      </div>
                      {isPricingOpen && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="price"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Price<span className="text-red-500">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      type="number"
                                      step="0.01"
                                      onChange={(e) =>
                                        field.onChange(Number(e.target.value))
                                      }
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="discount"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Compare at price
                                    <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      type="number"
                                      step="0.01"
                                      onChange={(e) =>
                                        field.onChange(Number(e.target.value))
                                      }
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="costPerUnit"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Cost per item</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="number"
                                    step="0.01"
                                    onChange={(e) =>
                                      field.onChange(Number(e.target.value))
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                                <p className="text-sm text-muted-foreground">
                                  Customers won't see this price.
                                </p>
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center gap-2">
                      <div className="flex gap-4">
                        <Button
                          type="submit"
                          className="bg-orange-500 hover:bg-orange-600"
                          disabled={submitting}
                        >
                          {submitting && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          {mode === 'create' ? 'Create' : 'Update'}
                        </Button>
                        {mode === 'edit' && (
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                          >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                          </Button>
                        )}
                        {mode === 'create' && (
                          <Button
                            type="button"
                            variant="outline"
                            className="bg-secondary-500
                            text-dark-100 hover:bg-orange-600 hover:text-white"
                            onClick={handleCreateAnother}
                          >
                            Create and Create Another
                          </Button>
                        )}
                        <Button
                          type="button"
                          onClick={() => window.history.back()}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="w-full lg:w-2/4 flex flex-col space-y-8">
              {/* Status Card */}
              <Card className="bg-white shadow-sm border border-gray-200">
                <CardHeader className="border-b px-6 py-4">
                  <CardTitle className="text-base font-medium">
                    Visibility
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                          />
                          <Label className="font-normal">Visible</Label>
                        </>
                      )}
                    />
                  </div>
                  <p className="text-gray-500 text-sm">
                    This product will be hidden from all sales channels.
                  </p>

                  <FormField
                    control={form.control}
                    name="availability"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>
                          Availability<span className="text-red-500">*</span>
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  'w-full pl-3 text-left font-normal',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value ? (
                                  format(field.value, 'PPP')
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Associations Card */}
              <Card className="bg-white shadow-sm border border-gray-200">
                <CardHeader className="border-b px-6 py-4">
                  <CardTitle className="text-base font-medium">
                    Associations
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <DynamicCategories
                    name="category"
                    label="Category"
                    isRequired
                  />
                </CardContent>
              </Card>
            </div>
          </Form>
        </div>
      </FormProvider>
    </>
  );
};

export default ProductForm;
