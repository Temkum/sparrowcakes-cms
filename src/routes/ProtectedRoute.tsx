import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { useEffect } from 'react';
import AdminBaseLayout from '@/pages/AdminBaseLayout';

const ProtectedRoute = () => {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth(); // Ensure auth state is updated on page reload
  }, [checkAuth]);

  return isAuthenticated ? (
    <AdminBaseLayout />
  ) : (
    <>
      <Navigate to="/login" state={{ from: location }} replace />
    </>
  );
};

export default ProtectedRoute;
