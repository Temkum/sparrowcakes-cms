import Layout from '@/pages/Layout';
import { createBrowserRouter } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';

const Root = createBrowserRouter([
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
