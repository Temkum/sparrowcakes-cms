import { passwordResetApi } from '@/services/api';
import ForgotPasswordDialog from './ForgotPasswordDialog';
import { useState } from 'react';

const ForgotPassword = () => {
  const [isForgotPasswordDialogOpen, setIsForgotPasswordDialogOpen] =
    useState(false);

  const handleForgotPasswordSubmit = async (email: string) => {
    await passwordResetApi.requestPasswordReset(email);
  };
  return (
    <>
      <h2>Forgot Password</h2>
      <ForgotPasswordDialog
        isOpen={isForgotPasswordDialogOpen}
        onOpenChange={setIsForgotPasswordDialogOpen}
        onSubmit={handleForgotPasswordSubmit}
      />
    </>
  );
};

export default ForgotPassword;
