import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Orders from './pages/Orders';
import Wishlist from './pages/Wishlist';
import Stores from './pages/Stores';
import VirtualTryOn from './pages/VirtualTryOn';
import SpecialPower from './pages/SpecialPower';
import TryAtHome from './pages/TryAtHome';
import { useDispatch } from 'react-redux';
import axios from './api/axios';
import { setUser } from './redux/authSlice';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('auth/profile/');
        dispatch(setUser(response.data));
      } catch (error) {
        // Not authenticated
      }
    };
    if (localStorage.getItem('access_token')) {
      fetchUser();
    }
  }, [dispatch]);

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Fallbacks */}
        <Route path="/orders" element={<Orders />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/stores" element={<Stores />} />
        <Route path="/try-on" element={<VirtualTryOn />} />
        <Route path="/special-power" element={<SpecialPower />} />
        <Route path="/try-at-home" element={<TryAtHome />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
