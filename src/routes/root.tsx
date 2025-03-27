import { createBrowserRouter } from 'react-router-dom';
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
        path: '/admin/orders',
        element: <OrdersPage />,
      },
      {
        path: '/admin/orders/new',
        element: <CreateOrder />,
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
    ],
  },
]);

export default Root;
