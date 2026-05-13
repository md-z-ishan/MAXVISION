import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { motion } from 'framer-motion';

const Checkout = () => {
  const [items, setItems] = useState([]);
  const [address, setAddress] = useState('');
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await axios.get('cart/');
      setItems(response.data);
      if (response.data.length === 0) {
        navigate('/cart');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('checkout/', { address, mobile });
      navigate('/orders', { state: { success: true } });
    } catch (error) {
      console.error(error);
      alert('Checkout failed.');
      setLoading(false);
    }
  };

  const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col lg:flex-row gap-8">
      {/* Shipping Details */}
      <div className="w-full lg:w-2/3 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-primary border-b pb-4">Shipping Address</h2>
        <form onSubmit={handleCheckout} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Delivery Address</label>
            <textarea 
              rows="4" 
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your full street address, apartment, city, and pincode"
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Mobile Number</label>
            <input 
              type="tel" 
              required
              maxLength="10"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="10-digit mobile number"
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
            />
          </div>
          <motion.button 
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className={`w-full text-white font-bold py-4 rounded-lg transition-colors shadow-md ${loading ? 'bg-teal-400' : 'bg-secondary hover:bg-teal-600'}`}
          >
            {loading ? 'Processing...' : 'Place Order securely'}
          </motion.button>
        </form>
      </div>

      {/* Order Summary */}
      <div className="w-full lg:w-1/3">
        <div className="bg-light p-6 rounded-xl border border-gray-200 sticky top-24">
          <h3 className="text-xl font-bold mb-4">Order Summary</h3>
          <div className="space-y-4 mb-6">
            {items.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-600 w-3/4 truncate">{item.quantity}x {item.product.name} ({item.lens_package.replace('_', ' ')})</span>
                <span className="font-semibold">₹{item.subtotal}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-300 pt-4 flex justify-between items-center font-bold text-xl text-primary">
            <span>Total Payable</span>
            <span>₹{totalAmount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
