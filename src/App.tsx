import { RouterProvider } from 'react-router-dom';
import Root from './routes/root.tsx';
import { fetchHello } from './services/api.ts';

fetchHello();

function App() {
  return (
    <>
      <RouterProvider router={Root} />
    </>
  );
}

export default App;
