import { RouterProvider } from 'react-router-dom';
import Root from './routes/root.tsx';
import { fetchHello } from './services/api.ts';
import { Toaster } from 'react-hot-toast';

fetchHello();

function App() {
  return (
    <>
      <Toaster />
      <RouterProvider router={Root} />
    </>
  );
}

export default App;
