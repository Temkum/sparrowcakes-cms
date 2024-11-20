import './App.css';
import Home from './pages/Home.tsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import Categories from './pages/Categories.tsx';
import Shop from './pages/Shop.tsx';
import ProductDetails from './pages/ProductDetails.tsx';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login toggleSidebar={() => {}} />} />
          <Route
            path="/register"
            element={<Register toggleSidebar={() => {}} />}
          />
          <Route path="/categories" element={<Categories />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/products/:id" element={<ProductDetails />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
