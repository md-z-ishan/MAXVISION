import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../api/axios';
import { FaHeart, FaRegHeart, FaTrash } from 'react-icons/fa';

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchWishlist();
  }, [isAuthenticated, navigate]);

  const fetchWishlist = async () => {
    try {
      const response = await axios.get('wishlist/');
      setItems(response.data);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await axios.post(`wishlist/toggle/${productId}/`);
      setItems(items.filter(item => item.product.id !== productId));
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  };

  if (loading) return <div className="text-center py-20 font-bold text-lg text-primary">Loading Wishlist...</div>;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="flex justify-center mb-6 text-gray-300">
          <FaRegHeart size={80} />
        </div>
        <h2 className="text-3xl font-bold mb-4 text-primary">Your Wishlist is Empty</h2>
        <p className="text-gray-500 mb-8">Save items you like in your wishlist to view them here.</p>
        <Link to="/products" className="bg-secondary text-white px-8 py-3 rounded-lg hover:bg-teal-600 transition-colors font-bold shadow-md">
          Explore Frames
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-primary flex items-center gap-3">
        <FaHeart className="text-red-500" /> My Wishlist ({items.length} Items)
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map(item => {
          const product = item.product;
          return (
            <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow relative flex flex-col">
              {/* Discount Tag */}
              {product.discount_percentage > 0 && (
                <span className="absolute top-4 left-4 bg-accent text-white text-xs font-bold px-2 py-1 rounded z-10">
                  {product.discount_percentage}% OFF
                </span>
              )}

              {/* Remove button */}
              <button 
                onClick={() => removeFromWishlist(product.id)}
                className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 transition-transform text-red-500 hover:text-red-600 focus:outline-none"
              >
                <FaTrash size={14} />
              </button>

              {/* Image */}
              <Link to={`/product/${product.id}`} className="mb-4 block overflow-hidden rounded-lg bg-gray-50">
                <img 
                  src={product.image_url || product.image || "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=500&h=400&fit=crop&auto=format"} 
                  alt={product.name} 
                  className="w-full h-40 object-contain mix-blend-multiply hover:scale-105 transition-transform duration-300"
                />
              </Link>

              {/* Title & color */}
              <div className="flex-grow">
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-bold text-primary hover:text-secondary transition-colors line-clamp-1">{product.name}</h3>
                </Link>
                <p className="text-xs text-gray-500 mb-2 capitalize">{product.frame_color} | {product.frame_shape}</p>
              </div>

              {/* Pricing & details button */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                <div>
                  <span className="font-extrabold text-primary text-base">₹{product.price * (1 - product.discount_percentage / 100)}</span>
                  {product.discount_percentage > 0 && (
                    <span className="text-xs text-gray-400 line-through ml-2">₹{product.price}</span>
                  )}
                </div>
                <Link to={`/product/${product.id}`} className="bg-secondary text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-teal-600 transition-colors">
                  Details
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;
