import Layout from '@/pages/Layout';
import { createBrowserRouter } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import BaseLayout from '@/pages/BaseLayout';
import Register from '@/pages/Register';
import Login from '@/pages/Login';

const Root = createBrowserRouter([
  {
    path: '/',
    element: <BaseLayout />,
    children: [
      {
        path: '/orders',
        element: <Dashboard />,
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
    path: '/admin',
    element: <Layout />,
    children: [
      {
        path: '/admin/dashboard',
        element: <Dashboard />,
      },
    ],
  },
]);

export default Root;
