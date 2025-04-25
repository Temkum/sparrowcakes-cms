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
import { Loader2 } from 'lucide-react';
import { CustomerFormProps } from '@/types/customer';
import toast, { Toaster } from 'react-hot-toast';

export function CreateCustomerModal({
  open,
  onOpenChange,
  onSuccess,
  mode = 'create',
  customer,
}: CustomerFormProps) {
  const [keepOpen, setKeepOpen] = useState(false);
  const { createCustomer, updateCustomer, submitting } = useCustomerStore();

  const form = useForm<z.infer<typeof customerFormSchema>>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      email: customer?.email || '',
      city: customer?.city || '',
      name: customer?.name || '',
      phone: customer?.phone || '',
      occupation: customer?.occupation || '',
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
      });
    } else {
      form.reset({
        email: '',
        city: '',
        name: '',
        phone: '',
        occupation: '',
      });
    }
  }, [customer, mode, form]);

  const handleSubmit = async (keepModalOpen: boolean) => {
    setKeepOpen(keepModalOpen);
    await form.handleSubmit(onSubmit)();
  };

  const onSubmit = async (values: z.infer<typeof customerFormSchema>) => {
    try {
      if (mode === 'edit' && customer) {
        await updateCustomer(customer.id, values);
        toast.success('Customer updated successfully');
        onOpenChange(false);
      } else {
        await createCustomer(values);
        toast.success('Customer created successfully');

        if (keepOpen) {
          // Reset form for "Create & create another"
          form.reset({
            email: '',
            city: '',
            name: '',
            phone: '',
            occupation: '',
          });
        } else {
          // Close modal for normal "Create"
          onOpenChange(false);
        }
      }

      // Always call onSuccess to refresh the list
      onSuccess?.();
    } catch (error: any) {
      console.error('Error creating/updating customer:', error);
      toast.error(
        `Failed to ${mode} customer: ${error.message || 'Unknown error'}`
      );
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
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  onClick={() => handleSubmit(false)}
                  className="bg-orange-500 hover:bg-orange-600"
                  disabled={submitting}
                >
                  {submitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {mode === 'edit' ? 'Update' : 'Create'}
                </Button>

                {mode === 'create' && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSubmit(true)}
                    disabled={submitting}
                  >
                    {submitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Create & create another
                  </Button>
                )}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={submitting}
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
