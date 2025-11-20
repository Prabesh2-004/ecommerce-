import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Product from './pages/Product';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './components/Layout';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import { CartProvider } from './context/cartContext';
import PlaceOrder from './pages/PlaceOrder';
import UserOrders from './pages/Order';

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = 'http://localhost:5000';
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const App = () => {
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    localStorage.getItem('token') ? localStorage.getItem('token') : ''
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(backendUrl + '/api/product');
        setProduct(response.data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProduct([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem('token', token);
  }, [token]);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const response = await axios.get('/api/auth');
          setUser(response.data);
        } catch (error) {
          console.log(
            'Fetch user error:',
            error.response?.data || error.message
          );
          localStorage.removeItem('token');
          setToken('');
          setUser(null);
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [token]);

  return (
    <CartProvider>
      <Layout user={user} token={token} setUser={setUser}>
        <Routes>
          <Route path='/' element={<Home product={product} />} />
          <Route
            path='/product'
            element={
              loading ? <div>Loading...</div> : <Product product={product} />
            }
          />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route
            path='/product/:id'
            element={<ProductDetails product={product} />}
          />
          <Route
            path='/login'
            element={user ? <Navigate to='/' /> : <Login setToken={setToken} />}
          />
          <Route
            path='/register'
            element={
              user ? <Navigate to='/' /> : <Register setToken={setToken} />
            }
          />
          <Route path='/cart' element={ <Cart /> } />
          <Route path='/place-order' element={<PlaceOrder user={user}  />} />
          <Route path='/user-order' element={<UserOrders />} />
        </Routes>
      </Layout>
    </CartProvider>
  );
};

export default App;
