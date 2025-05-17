import { useState, useEffect } from 'react';
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
import customerFormSchema from '@/form-schema/customerFormSchema';
import useCustomerStore from '@/store/customer-store';
import { Loader2, X } from 'lucide-react';
import { CustomerFormProps } from '@/types/customer';
import toast, { Toaster } from 'react-hot-toast';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import ImageUploadField from '@/components/ImageUploadField';
import { useAuthStore } from '@/store/auth';
import axiosInstance from '@/services/axiosInstance';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function CreateCustomerModal({
  open,
  onOpenChange,
  onSuccess,
  mode = 'create',
  customer,
}: CustomerFormProps) {
  const [keepOpen, setKeepOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // We'll use direct API calls for file uploads instead of the store methods
  useCustomerStore(); // Keep the store connection for future compatibility
  const { token } = useAuthStore();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isImageRemoved, setIsImageRemoved] = useState(false);

  const form = useForm<z.infer<typeof customerFormSchema>>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      email: customer?.email || '',
      city: customer?.city || '',
      name: customer?.name || '',
      address: customer?.address || '',
      postal_code: customer?.postal_code || '',
      country: customer?.country || '',
      state: customer?.state || '',
      phone: customer?.phone || '',
      occupation: customer?.occupation || '',
      image_url: customer?.image_url || '',
    },
  });

  useEffect(() => {
    if (customer && mode === 'edit') {
      form.reset({
        email: customer.email || '',
        city: customer.city || '',
        name: customer.name || '',
        phone: customer.phone || '',
        occupation: customer.occupation || '',
        address: customer.address || '',
        state: customer.state || '',
        postal_code: customer.postal_code || '',
        country: customer.country || '',
        image_url: customer.image_url || '',
      });
    } else {
      form.reset({
        email: '',
        city: '',
        name: '',
        address: '',
        state: '',
        postal_code: '',
        country: '',
        phone: '',
        occupation: '',
        image_url: '',
      });
    }
  }, [customer, mode, form]);

  const handleSubmit = async (keepModalOpen: boolean) => {
    setKeepOpen(keepModalOpen);
    await form.handleSubmit(onSubmit)();
  };

  const onSubmit = async (values: z.infer<typeof customerFormSchema>) => {
    try {
      setIsSubmitting(true);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('email', values.email || '');
      formData.append('phone', values.phone);
      formData.append('city', values.city || '');
      formData.append('address', values.address || '');
      formData.append('postal_code', values.postal_code || '');
      formData.append('country', values.country || '');
      formData.append('state', values.state || '');
      formData.append('occupation', values.occupation || '');

      // Handle image upload
      if (isImageRemoved && mode === 'edit') {
        formData.append('isImageDeleted', 'true');
      } else if (imageFile) {
        formData.append('image', imageFile);
      }

      // API endpoint URL
      const url =
        mode === 'edit' && customer
          ? `${API_BASE_URL}/customers/${customer.id}`
          : `${API_BASE_URL}/customers`;

      // HTTP method
      const method = mode === 'edit' ? 'patch' : 'post';

      // Send request to server
      await axiosInstance[method](url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success(
        `Customer ${mode === 'edit' ? 'updated' : 'created'} successfully`
      );

      if (keepOpen && mode === 'create') {
        // Reset form for "Create & create another"
        form.reset({
          email: '',
          city: '',
          name: '',
          address: '',
          postal_code: '',
          country: '',
          state: '',
          phone: '',
          occupation: '',
          image_url: '',
        });
        setImageFile(null);
        setIsImageRemoved(false);
      } else {
        // Close modal for normal "Create"
        onOpenChange(false);
      }

      // Always call onSuccess to refresh the list
      onSuccess?.();
    } catch (error) {
      console.error('Error creating/updating customer:', error);
      toast.error(
        `Failed to ${mode} customer: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toaster />
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="sm:max-w-4xl"
          aria-labelledby="create-customer"
          aria-describedby="create-customer-form"
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {mode === 'edit' ? 'Edit customer' : 'Create customer'}
            </DialogTitle>
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
                        <Input {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="occupation"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel>Occupation</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel>Country</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="CM">Cameroon</SelectItem>
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="CA">Canada</SelectItem>
                          <SelectItem value="FR">France</SelectItem>
                          <SelectItem value="DE">Germany</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel>State/Region</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="postal_code"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Customer Image</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          {field.value ? (
                            <div className="relative w-32 h-32 mx-auto">
                              <img
                                src={field.value}
                                alt="Customer avatar"
                                className="w-full h-full object-cover rounded-full border-2 border-gray-200"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  field.onChange('');
                                  setImageFile(null);
                                  setIsImageRemoved(true);
                                }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : null}

                          <ImageUploadField
                            onChange={field.onChange}
                            value={field.value || ''}
                            onFileChange={(file) => {
                              setImageFile(file);
                              setIsImageRemoved(false);
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  onClick={() => handleSubmit(false)}
                  className="bg-orange-500 hover:bg-orange-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {mode === 'edit' ? 'Update' : 'Create'}
                </Button>

                {mode === 'create' && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSubmit(true)}
                    disabled={isSubmitting}
                  >
                    {isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Create & create another
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
    </>
  );
}

export default CreateCustomerModal;
