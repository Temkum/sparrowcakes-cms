import { RouterProvider } from 'react-router-dom';
import './App.css';
import Root from './routes/root.tsx';

function App() {
  return (
    <>
      <RouterProvider router={Root} />
    </>
  );
}

export default App;
