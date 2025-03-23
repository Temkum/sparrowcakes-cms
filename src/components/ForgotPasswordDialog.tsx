import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

interface ForgotPasswordDialogProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit?: (email: string) => Promise<void>;
}

const ForgotPasswordDialog = ({
  isOpen = false,
  onOpenChange = () => {},
  onSubmit = async () => {},
}: ForgotPasswordDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      setLoading(true);
      setError('');
      await onSubmit(values.email);
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            Reset Your Password
          </AlertDialogTitle>
          <AlertDialogDescription>
            {success ? (
              <>
                Check your email for a password reset link. If you don't receive
                an email, please check your spam folder.
              </>
            ) : (
              'Enter your email address to receive a password reset link.'
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {!success ? (
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="space-y-4">
              <Input
                {...form.register('email')}
                placeholder="Your email"
                disabled={loading}
                className={form.formState.errors.email ? 'border-red-500' : ''}
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
              <Button type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </AlertDialogFooter>
          </form>
        ) : (
          <AlertDialogFooter>
            <Button
              onClick={() => {
                setSuccess(false);
                onOpenChange(false);
              }}
            >
              Close
            </Button>
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ForgotPasswordDialog;
