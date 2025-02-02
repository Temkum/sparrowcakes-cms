import { RouterProvider } from 'react-router-dom';
import Root from './routes/root.tsx';

function App() {
  return (
    <>
      <RouterProvider router={Root} />
    </>
  );
}

export default App;
