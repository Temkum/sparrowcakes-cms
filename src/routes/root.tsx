import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorBoundary from '@/components/error-boundary/ErrorBoundary';
import BaseLayout from '@/pages/BaseLayout';
import Register from '@/pages/Register';
import Login from '@/pages/Login';
import ResetPassword from '@/pages/ResetPassword';
import ResetPasswordLink from '@/pages/ResetPasswordLink';
import Home from '@/pages/Home';
import ProductDashboard from '@/pages/admin/products/ProductDashboard';
import Users from '@/pages/admin/Users';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import OrdersPage from '@/pages/admin/orders/Orders';
import Customers from '@/pages/admin/customers/Customers';
import CategoriesPage from '@/pages/admin/categories/Categories';
import CreateOrder from '@/pages/admin/orders/CreateOrder';
import ProtectedRoute from './ProtectedRoute';
import AddProduct from '@/pages/admin/products/AddProduct';
import { ProductDetails } from '@/pages/admin/products/ProductDetails';
import ProductEdit from '@/pages/admin/products/ProductEdit';
import ViewOrder from '@/pages/admin/orders/ViewOrder';
import EditOrder from '@/pages/admin/orders/EditOrder';
import ReviewsPage from '@/pages/admin/reviews/Reviews';
import NotFound from '@/pages/NotFound';
import TestError from '@/pages/TestError';

const router = createBrowserRouter([
  {
    path: '/',
    element: <BaseLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
    ],
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/forgot-password',
    element: <ResetPasswordLink />,
  },
  {
    path: '/reset-password/:token',
    element: <ResetPassword />,
  },
  {
    path: '/admin',
    element: <ProtectedRoute />,
    children: [
      {
        path: '/admin/dashboard',
        element: <AdminDashboard />,
      },
      {
        path: '/admin/products',
        element: <ProductDashboard />,
      },
      {
        path: '/admin/products/new',
        element: <AddProduct />,
      },
      {
        path: '/admin/products/:id',
        element: <ProductDetails />,
      },
      {
        path: '/admin/products/edit/:id',
        element: <ProductEdit />,
      },
      {
        path: '/admin/orders',
        element: <OrdersPage />,
      },
      {
        path: '/admin/orders/new',
        element: <CreateOrder />,
      },
      {
        path: '/admin/orders/:id',
        element: <ViewOrder />,
      },
      {
        path: '/admin/orders/:id/edit',
        element: <EditOrder />,
      },
      {
        path: '/admin/users',
        element: <Users />,
      },
      {
        path: '/admin/customers',
        element: <Customers />,
      },
      {
        path: '/admin/customers/new',
        element: <Customers />,
      },
      {
        path: '/admin/categories',
        element: <CategoriesPage />,
      },
      {
        path: '/admin/categories/new',
        element: <CategoriesPage />,
      },
      {
        path: '/admin/reviews',
        element: <ReviewsPage />,
      },
    ],
  },
  {
    path: '/test-error',
    element: <TestError />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

// Create a component that renders the router
const Root = () => (
  <ErrorBoundary>
    <RouterProvider router={router} />
  </ErrorBoundary>
);

export default Root;
