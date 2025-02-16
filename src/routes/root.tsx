import Layout from '@/pages/Layout';
import { createBrowserRouter } from 'react-router-dom';
import BaseLayout from '@/pages/BaseLayout';
import Register from '@/pages/Register';
import Login from '@/pages/Login';
import ResetPassword from '@/pages/ResetPassword';
import ResetPasswordLink from '@/pages/ResetPasswordLink';
import Home from '@/pages/Home';
import ProductDashboard from '@/pages/admin/ProductDashboard';
import Users from '@/pages/admin/Users';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import OrdersPage from '@/pages/admin/Orders';
import Customers from '@/pages/admin/Customers';
import CategoriesPage from '@/pages/admin/Categories';

const Root = createBrowserRouter([
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
    path: '/reset-password',
    element: <ResetPasswordLink />,
  },
  {
    path: '/reset-password/:token',
    element: <ResetPassword />,
  },
  {
    path: '/admin',
    element: <Layout />,
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
        path: '/admin/orders',
        element: <OrdersPage />,
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
        path: '/admin/categories',
        element: <CategoriesPage />,
      },
    ],
  },
]);

export default Root;
