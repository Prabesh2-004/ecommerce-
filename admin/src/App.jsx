import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Add from './pages/Add';
import List  from './pages/List';
import Order from './pages/Order';
import Login from './components/Login';
import axios from 'axios';
import Layout from './components/Layout';
import Navbar from './components/Navbar';

export const backendUrl = 'https://ecommerce-backend-ttga.onrender.com';
axios.defaults.baseURL = 'https://ecommerce-backend-ttga.onrender.com';
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem('token') ? localStorage.getItem('token') : ''
  );

  useEffect(() => {
    localStorage.setItem('token', token);
  }, [token]);

  return (
    <>
    <Navbar />
      {token === '' ? (
        <Login setToken={setToken}  />
      ) : (
        <Layout token={token} setToken={setToken}>
          <Routes>
            <Route path='/add' element={<Add token={token} />} />
            <Route path='/' element={<List token={token} />} />
            <Route path='/order' element={<Order token={token} />} />
          </Routes>
        </Layout>
      )}
    </>
  );
};

export default App;
