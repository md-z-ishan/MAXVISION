import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../api/axios';
import { motion } from 'framer-motion';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [wishlistedIds, setWishlistedIds] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setWishlistedIds([]);
    }
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    try {
      const response = await axios.get('wishlist/');
      const ids = response.data.map(item => item.product.id);
      setWishlistedIds(ids);
    } catch (error) {
      console.error("Failed to fetch wishlist", error);
    }
  };

  const toggleWishlist = async (productId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      const response = await axios.post(`wishlist/toggle/${productId}/`);
      if (response.data.status === 'added') {
        setWishlistedIds([...wishlistedIds, productId]);
      } else {
        setWishlistedIds(wishlistedIds.filter(id => id !== productId));
      }
    } catch (error) {
      console.error("Failed to toggle wishlist", error);
    }
  };
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  // Filters state
  const [filters, setFilters] = useState({
    category: queryParams.get('category') || '',
    shape: queryParams.get('shape') || '',
    size: queryParams.get('size') || '',
    brand: queryParams.get('brand') || '',
  });

  useEffect(() => {
    fetchProducts();
  }, [filters, location.search]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await axios.get(`products/?${params}`);
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-1/4 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
        <h2 className="text-xl font-bold mb-6 text-primary border-b pb-2">Filter Eyewear</h2>
        
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
          <select name="category" value={filters.category} onChange={handleFilterChange} className="w-full border-gray-300 rounded-md p-2 bg-light">
            <option value="">All</option>
            <option value="eyeglasses">Eyeglasses</option>
            <option value="sunglasses">Sunglasses</option>
            <option value="computer_glasses">Computer Glasses</option>
            <option value="contact_lenses">Contact Lenses</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Frame Shape</label>
          <select name="shape" value={filters.shape} onChange={handleFilterChange} className="w-full border-gray-300 rounded-md p-2 bg-light">
            <option value="">All</option>
            <option value="rectangle">Rectangle</option>
            <option value="round">Round</option>
            <option value="wayfarer">Wayfarer</option>
            <option value="aviator">Aviator</option>
            <option value="cat_eye">Cat Eye</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Frame Size</label>
          <select name="size" value={filters.size} onChange={handleFilterChange} className="w-full border-gray-300 rounded-md p-2 bg-light">
            <option value="">All</option>
            <option value="narrow">Narrow</option>
            <option value="medium">Medium</option>
            <option value="wide">Wide</option>
            <option value="extra_wide">Extra Wide</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Brand</label>
          <select name="brand" value={filters.brand} onChange={handleFilterChange} className="w-full border-gray-300 rounded-md p-2 bg-light">
            <option value="">All</option>
            <option value="Vincent Chase">Vincent Chase</option>
            <option value="Lenskart">Lenskart</option>
            <option value="John Jacobs">John Jacobs</option>
          </select>
        </div>
      </aside>

      {/* Product Grid */}
      <div className="w-full md:w-3/4">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="animate-pulse bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="bg-gray-200 h-48 rounded-md mb-4"></div>
                <div className="bg-gray-200 h-4 w-3/4 mb-2"></div>
                <div className="bg-gray-200 h-4 w-1/2 mb-4"></div>
                <div className="bg-gray-200 h-8 w-full rounded-md"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.length === 0 ? (
              <div className="col-span-full text-center py-20 text-gray-500">
                <p className="text-xl">No products found for these filters.</p>
              </div>
            ) : (
              products.map((product) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={product.id} 
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow relative flex flex-col"
                >
                  {product.discount_percentage > 0 && (
                    <span className="absolute top-4 left-4 bg-accent text-white text-xs font-bold px-2 py-1 rounded">
                      {product.discount_percentage}% OFF
                    </span>
                  )}

                  {/* Wishlist Toggle Heart Button */}
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 transition-transform text-red-500 hover:text-red-600 focus:outline-none"
                  >
                    {wishlistedIds.includes(product.id) ? (
                      <FaHeart size={16} />
                    ) : (
                      <FaRegHeart size={16} className="text-gray-400 hover:text-red-500" />
                    )}
                  </button>
                  
                  <Link to={`/product/${product.id}`} className="mb-4 block overflow-hidden rounded-lg bg-gray-50">
                    <img 
                      src={product.image_url || product.image || "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=500&h=400&fit=crop&auto=format"} 
                      alt={product.name} 
                      loading="lazy"
                      className="w-full h-48 object-contain mix-blend-multiply hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  <div className="flex-grow">
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-bold text-primary hover:text-secondary transition-colors line-clamp-1">{product.name}</h3>
                    </Link>
                    <p className="text-sm text-gray-500 mb-2 capitalize">{product.frame_color} | {product.frame_shape}</p>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <span className="font-bold text-lg">₹{product.price * (1 - product.discount_percentage / 100)}</span>
                      {product.discount_percentage > 0 && (
                        <span className="text-sm text-gray-400 line-through ml-2">₹{product.price}</span>
                      )}
                    </div>
                    <Link to={`/product/${product.id}`} className="text-secondary font-semibold hover:underline">
                      Details
                    </Link>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
