import { GalleryVerticalEnd } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { passwordResetApi } from '@/services/api';
import ForgotPasswordDialog from '@/components/ForgotPasswordDialog';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type FormValues = z.infer<typeof formSchema>;

const ResetPasswordLink: React.FC = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) => {
  const [isForgotPasswordDialogOpen, setIsForgotPasswordDialogOpen] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      setError('');
      const response = await passwordResetApi.requestPasswordReset(
        values.email
      );

      if (response?.error) {
        toast.error(response.error.message);
      } else {
        setIsForgotPasswordDialogOpen(true);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        // Access the error message from the backend response
        const errorMessage = err.response?.data?.message || err.message;
        toast.error(errorMessage);
      } else {
        toast.error(
          err instanceof Error ? err.message : 'An unexpected error occurred'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
        <div className="w-full max-w-sm">
          <div className={cn('flex flex-col gap-6', className)} {...props}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center gap-2">
                  <Link to="/" className="flex items-center gap-2 font-medium">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md">
                      <GalleryVerticalEnd className="size-6" />
                    </div>
                    <span className="font-bold">Cakes By Sparrow</span>
                    <span className="sr-only">Cakes By Sparrow</span>
                  </Link>
                  <div className="text-center text-sm">
                    Enter your email address below and we'll send you a link to
                    reset your password.
                  </div>
                </div>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      {...register('email')}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      <ForgotPasswordDialog
        isOpen={isForgotPasswordDialogOpen}
        onOpenChange={setIsForgotPasswordDialogOpen}
      />

      <Toaster />
    </>
  );
};

export default ResetPasswordLink;
