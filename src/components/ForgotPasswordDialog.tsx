import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface ForgotPasswordDialogProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const ForgotPasswordDialog = ({
  isOpen = false,
  onOpenChange = () => {},
}: ForgotPasswordDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            Reset Your Password
          </AlertDialogTitle>
          <AlertDialogDescription>
            Check your email for a password reset link. If you don't receive an
            email, please check your spam folder.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            onClick={() => {
              onOpenChange(false);
            }}
          >
            Close
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ForgotPasswordDialog;
