import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { FaTrash, FaShieldAlt } from 'react-icons/fa';

const Cart = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await axios.get('cart/');
      setItems(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (id, action) => {
    try {
      await axios.patch(`cart/update/${id}/${action}/`);
      fetchCart();
    } catch (error) {
      console.error(error);
    }
  };

  const removeItem = async (id) => {
    try {
      await axios.delete(`cart/${id}/`);
      fetchCart();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="text-center py-20 font-bold">Loading Cart...</div>;

  const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4 text-primary">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/products" className="bg-secondary text-white px-8 py-3 rounded hover:bg-teal-600 transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col lg:flex-row gap-8">
      {/* Cart Items */}
      <div className="w-full lg:w-2/3">
        <h1 className="text-2xl font-bold mb-6 text-primary">Shopping Cart ({items.length} Items)</h1>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
          {items.map(item => (
            <div key={item.id} className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
              <div className="w-32 h-32 bg-light rounded-lg flex items-center justify-center p-2">
                <img src={item.product.image || "https://via.placeholder.com/150"} alt={item.product.name} className="w-full h-full object-contain mix-blend-multiply" />
              </div>
              
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-primary">{item.product.name}</h3>
                  <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <FaTrash />
                  </button>
                </div>
                <p className="text-sm text-gray-500 mb-1 capitalize">Color: {item.product.frame_color}</p>
                <div className="text-sm bg-blue-50 text-blue-800 p-2 rounded mb-4 inline-block">
                  <span className="font-semibold">Lens:</span> {item.lens_package.replace('_', ' ').toUpperCase()} 
                  {item.lens_price > 0 && ` (+₹${item.lens_price})`}
                </div>
                
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center border border-gray-300 rounded">
                    <button onClick={() => updateQuantity(item.id, 'decrease')} className="px-3 py-1 hover:bg-gray-100">-</button>
                    <span className="px-3 py-1 border-x border-gray-300">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 'increase')} className="px-3 py-1 hover:bg-gray-100">+</button>
                  </div>
                  <div className="font-extrabold text-xl">₹{item.subtotal}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="w-full lg:w-1/3">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
          <h2 className="text-xl font-bold mb-6 border-b pb-4">Bill Details</h2>
          
          <div className="space-y-3 mb-6 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Item Total</span>
              <span>₹{totalAmount}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Delivery Charges</span>
              <span>FREE</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-4 border-t border-gray-100">
              <span>Total Payable</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>

          <div className="bg-green-50 p-3 rounded flex items-center gap-2 text-green-800 text-xs mb-6">
            <FaShieldAlt size={16} />
            <span>Safe & Secure Payments. Easy returns. 100% Authentic products.</span>
          </div>

          <button 
            onClick={() => navigate('/checkout')}
            className="w-full bg-secondary hover:bg-teal-600 text-white font-bold py-4 rounded-lg transition-colors shadow-md"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
