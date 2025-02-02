import Layout from '@/pages/Layout';
import { createBrowserRouter } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import BaseLayout from '@/pages/BaseLayout';

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
