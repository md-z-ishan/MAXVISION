import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaRegHeart, FaFilter, FaTimes, FaSlidersH, FaChevronRight } from 'react-icons/fa';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOptions, setFilterOptions] = useState({
    categories: ['eyeglasses', 'sunglasses', 'computer_glasses', 'contact_lenses'],
    brands: ['Ray-Ban', 'Oakley', 'Titan Eye+', 'Fastrack', 'Vincent Chase', 'John Jacobs', 'Acuvue', 'Bausch + Lomb', 'Alcon'],
    shapes: ['rectangle', 'round', 'wayfarer', 'aviator', 'cat_eye', 'geometric'],
    sizes: ['narrow', 'medium', 'wide', 'extra_wide'],
    lens_types: ['spherical', 'toric', 'multifocal', 'colored'],
    wear_durations: ['daily', 'monthly', 'yearly']
  });
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [wishlistedIds, setWishlistedIds] = useState([]);

  // Read current filters from URL search params
  const categoryParam = searchParams.get('category') || '';
  const isContactLens = categoryParam.toLowerCase() === 'contact_lenses' || categoryParam.toLowerCase() === 'contacts';
  const shapeParam = searchParams.get('shape') || '';
  const sizeParam = searchParams.get('size') || '';
  const brandParam = searchParams.get('brand') || '';
  const lensTypeParam = searchParams.get('lens_type') || '';
  const wearDurationParam = searchParams.get('wear_duration') || '';
  const minPriceParam = searchParams.get('min_price') || '';
  const maxPriceParam = searchParams.get('max_price') || '';
  const orderingParam = searchParams.get('ordering') || 'recommended';
  const queryParam = searchParams.get('q') || searchParams.get('search') || '';

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setWishlistedIds([]);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const fetchFilterOptions = async () => {
    try {
      const res = await axios.get('products/filter_options/');
      if (res.data) {
        setFilterOptions((prev) => ({
          ...prev,
          ...res.data
        }));
      }
    } catch (err) {
      // Keep defaults if endpoint not ready
    }
  };

  const fetchWishlist = async () => {
    try {
      const response = await axios.get('wishlist/');
      const ids = response.data.map((item) => item.product?.id || item.product);
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
        setWishlistedIds(wishlistedIds.filter((id) => id !== productId));
      }
    } catch (error) {
      console.error("Failed to toggle wishlist", error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryStr = searchParams.toString();
      const response = await axios.get(`products/${queryStr ? `?${queryStr}` : ''}`);
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }
    // If switching category, clear shape & size or contact lens specific filters
    if (key === 'category') {
      if (value === 'contact_lenses') {
        nextParams.delete('shape');
        nextParams.delete('size');
      } else {
        nextParams.delete('lens_type');
        nextParams.delete('wear_duration');
      }
    }
    setSearchParams(nextParams);
  };

  const clearAllFilters = () => {
    const nextParams = new URLSearchParams();
    if (categoryParam) {
      nextParams.set('category', categoryParam);
    }
    setSearchParams(nextParams);
  };

  const getCategoryTitle = () => {
    if (categoryParam === 'contact_lenses' || categoryParam === 'contacts') return 'Contact Lenses';
    if (categoryParam === 'eyeglasses') return 'Eyeglasses';
    if (categoryParam === 'sunglasses') return 'Sunglasses';
    if (categoryParam === 'computer_glasses') return 'Computer Glasses';
    if (queryParam) return `Search Results for "${queryParam}"`;
    return 'All Eyewear';
  };

  const activeFiltersCount = [
    shapeParam, sizeParam, brandParam, lensTypeParam, wearDurationParam, minPriceParam, maxPriceParam
  ].filter(Boolean).length;

  return (
    <div className="bg-gray-50 min-h-screen py-6 md:py-8">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs md:text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:text-secondary transition-colors">Home</Link>
          <FaChevronRight size={10} className="text-gray-400" />
          <Link to="/products" className="hover:text-secondary transition-colors">Products</Link>
          {categoryParam && (
            <>
              <FaChevronRight size={10} className="text-gray-400" />
              <span className="text-primary font-bold capitalize">{getCategoryTitle()}</span>
            </>
          )}
        </nav>

        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-gray-200 gap-4">
          <div>
            <div className="flex items-baseline gap-3">
              <h1 className="text-2xl md:text-3xl font-black text-primary tracking-tight">
                {getCategoryTitle()}
              </h1>
              <span className="text-sm font-semibold text-gray-500">
                ({products.length} {products.length === 1 ? 'item' : 'items'})
              </span>
            </div>
            {isContactLens && (
              <p className="text-xs md:text-sm text-gray-600 mt-1">
                Premium daily disposables, monthly comfort, and colored contact lenses delivered from MAXVISION Ranchi.
              </p>
            )}
          </div>

          {/* Sort & Mobile Filter Toggle */}
          <div className="flex items-center gap-3">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="md:hidden flex items-center gap-2 bg-white px-3.5 py-2 border border-gray-200 rounded-lg text-xs font-bold text-primary shadow-sm hover:border-secondary"
            >
              <FaSlidersH className="text-secondary" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-secondary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <label htmlFor="sort-select" className="text-xs font-bold text-gray-600 hidden sm:inline whitespace-nowrap">Sort by:</label>
              <select
                id="sort-select"
                value={orderingParam}
                onChange={(e) => updateFilter('ordering', e.target.value)}
                className="bg-white border border-gray-200 text-primary font-bold text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-secondary shadow-sm"
              >
                <option value="recommended">Recommended</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
                <option value="discount">Highest Discount</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          
          {/* Desktop Sidebar Filters */}
          <aside className="w-full md:w-64 lg:w-72 bg-white p-5 rounded-xl border border-gray-200 shadow-sm shrink-0 hidden md:block">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2 font-bold text-primary text-base">
                <FaFilter size={14} className="text-secondary" />
                <span>Filters</span>
              </div>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs font-bold text-secondary hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Category Select */}
            <div className="mb-5">
              <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">Category</label>
              <select
                value={categoryParam}
                onChange={(e) => updateFilter('category', e.target.value)}
                className="w-full border border-gray-200 rounded-lg p-2 text-xs font-medium text-gray-800 bg-gray-50/50 focus:outline-none focus:border-secondary"
              >
                <option value="">All Categories</option>
                <option value="eyeglasses">Eyeglasses</option>
                <option value="sunglasses">Sunglasses</option>
                <option value="computer_glasses">Computer Glasses</option>
                <option value="contact_lenses">Contact Lenses</option>
              </select>
            </div>

            {/* Conditional Contact Lens Filters */}
            {isContactLens ? (
              <>
                {/* Lens Type */}
                <div className="mb-5">
                  <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">Lens Type</label>
                  <select
                    value={lensTypeParam}
                    onChange={(e) => updateFilter('lens_type', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-2 text-xs font-medium text-gray-800 bg-gray-50/50 focus:outline-none focus:border-secondary"
                  >
                    <option value="">All Lens Types</option>
                    <option value="spherical">Spherical</option>
                    <option value="toric">Toric (Astigmatism)</option>
                    <option value="multifocal">Multifocal</option>
                    <option value="colored">Colored</option>
                  </select>
                </div>

                {/* Wear Duration */}
                <div className="mb-5">
                  <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">Wear Duration</label>
                  <select
                    value={wearDurationParam}
                    onChange={(e) => updateFilter('wear_duration', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-2 text-xs font-medium text-gray-800 bg-gray-50/50 focus:outline-none focus:border-secondary"
                  >
                    <option value="">All Durations</option>
                    <option value="daily">Daily Disposables</option>
                    <option value="monthly">Monthly Disposable</option>
                    <option value="yearly">Yearly Conventional</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                {/* Frame Shape */}
                <div className="mb-5">
                  <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">Frame Shape</label>
                  <select
                    value={shapeParam}
                    onChange={(e) => updateFilter('shape', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-2 text-xs font-medium text-gray-800 bg-gray-50/50 focus:outline-none focus:border-secondary capitalize"
                  >
                    <option value="">All Shapes</option>
                    {filterOptions.shapes.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Frame Size */}
                <div className="mb-5">
                  <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">Frame Size</label>
                  <select
                    value={sizeParam}
                    onChange={(e) => updateFilter('size', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-2 text-xs font-medium text-gray-800 bg-gray-50/50 focus:outline-none focus:border-secondary capitalize"
                  >
                    <option value="">All Sizes</option>
                    {filterOptions.sizes.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {/* Brand Filter */}
            <div className="mb-5">
              <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">Brand</label>
              <select
                value={brandParam}
                onChange={(e) => updateFilter('brand', e.target.value)}
                className="w-full border border-gray-200 rounded-lg p-2 text-xs font-medium text-gray-800 bg-gray-50/50 focus:outline-none focus:border-secondary"
              >
                <option value="">All Brands</option>
                {filterOptions.brands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div className="mb-2">
              <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">Price Range (₹)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPriceParam}
                  onChange={(e) => updateFilter('min_price', e.target.value)}
                  className="w-1/2 border border-gray-200 rounded-lg p-2 text-xs text-gray-800 focus:outline-none focus:border-secondary"
                />
                <span className="text-gray-400 text-xs">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPriceParam}
                  onChange={(e) => updateFilter('max_price', e.target.value)}
                  className="w-1/2 border border-gray-200 rounded-lg p-2 text-xs text-gray-800 focus:outline-none focus:border-secondary"
                />
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="flex-1 w-full">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="animate-pulse bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                    <div className="bg-gray-200 h-4 w-3/4 mb-2"></div>
                    <div className="bg-gray-200 h-3 w-1/2 mb-4"></div>
                    <div className="flex justify-between items-center">
                      <div className="bg-gray-200 h-5 w-20"></div>
                      <div className="bg-gray-200 h-5 w-14"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
                <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaFilter size={24} />
                </div>
                <h3 className="text-lg font-bold text-primary mb-1">No products found</h3>
                <p className="text-xs text-gray-500 mb-6 max-w-sm mx-auto">
                  We couldn't find any products matching your active filters. Try resetting your search or adjusting filter criteria.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-secondary text-white font-bold text-xs px-6 py-2.5 rounded-lg hover:bg-opacity-90 transition-all shadow-sm"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map((product) => {
                  const finalPrice = product.price * (1 - product.discount_percentage / 100);
                  const isOutOfStock = product.stock_quantity <= 0;

                  return (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      key={product.id}
                      className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200 relative flex flex-col group"
                    >
                      {/* Badge: Out of Stock or Discount */}
                      {isOutOfStock ? (
                        <span className="absolute top-3 left-3 bg-gray-800 text-white text-[11px] font-bold px-2.5 py-1 rounded shadow-sm z-10">
                          Out of Stock
                        </span>
                      ) : product.discount_percentage > 0 && (
                        <span className="absolute top-3 left-3 bg-accent text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-sm z-10">
                          {product.discount_percentage}% OFF
                        </span>
                      )}

                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleWishlist(product.id);
                        }}
                        aria-label="Wishlist"
                        className="absolute top-3 right-3 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 transition-transform text-red-500 focus:outline-none"
                      >
                        {wishlistedIds.includes(product.id) ? (
                          <FaHeart size={15} />
                        ) : (
                          <FaRegHeart size={15} className="text-gray-400 hover:text-red-500" />
                        )}
                      </button>

                      {/* Product Image */}
                      <Link to={`/product/${product.id}`} className="mb-3 block overflow-hidden rounded-lg bg-gray-50">
                        <img
                          src={product.image_url || product.image || "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=500&h=400&fit=crop&auto=format"}
                          alt={product.name}
                          loading="lazy"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=400&fit=crop";
                          }}
                          className="w-full h-44 sm:h-48 object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>

                      {/* Product Meta Info */}
                      <div className="flex-grow">
                        {product.brand && (
                          <p className="text-[11px] font-extrabold text-secondary uppercase tracking-wider mb-1">
                            {product.brand}
                          </p>
                        )}
                        <Link to={`/product/${product.id}`}>
                          <h3 className="font-bold text-sm text-primary group-hover:text-secondary transition-colors line-clamp-1">
                            {product.name}
                          </h3>
                        </Link>
                        {product.category === 'contact_lenses' ? (
                          <p className="text-xs text-gray-500 mt-1 capitalize">
                            {product.wear_duration || 'Daily'} | {product.lens_type || 'Spherical'} {product.pack_size ? `• ${product.pack_size}` : ''}
                          </p>
                        ) : (
                          <p className="text-xs text-gray-500 mt-1 capitalize">
                            {product.frame_color || 'Standard'} {product.frame_shape ? `• ${product.frame_shape}` : ''} {product.frame_size ? `(${product.frame_size})` : ''}
                          </p>
                        )}
                      </div>

                      {/* Price & Action */}
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                        <div>
                          <span className="font-black text-base text-primary">₹{Math.round(finalPrice)}</span>
                          {product.discount_percentage > 0 && (
                            <span className="text-xs text-gray-400 line-through ml-2">₹{Math.round(product.price)}</span>
                          )}
                        </div>
                        <Link
                          to={`/product/${product.id}`}
                          className="text-xs font-bold text-secondary hover:text-primary transition-colors flex items-center gap-1"
                        >
                          <span>Details</span>
                          <FaChevronRight size={9} />
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </main>
        </div>

        {/* Mobile Filter Drawer Modal */}
        <AnimatePresence>
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 flex md:hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileFilterOpen(false)}
                className="fixed inset-0 bg-black/40 backdrop-blur-xs"
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.25 }}
                className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl flex flex-col z-10"
              >
                {/* Drawer Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FaSlidersH className="text-secondary" />
                    <h2 className="font-bold text-primary text-base">Filter Products</h2>
                  </div>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-2 text-gray-400 hover:text-gray-700"
                  >
                    <FaTimes size={16} />
                  </button>
                </div>

                {/* Drawer Body */}
                <div className="p-4 flex-1 overflow-y-auto space-y-4">
                  {/* Category */}
                  <div>
                    <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-1.5">Category</label>
                    <select
                      value={categoryParam}
                      onChange={(e) => updateFilter('category', e.target.value)}
                      className="w-full border border-gray-200 rounded-lg p-2.5 text-xs text-gray-800 bg-gray-50 focus:outline-none"
                    >
                      <option value="">All Categories</option>
                      <option value="eyeglasses">Eyeglasses</option>
                      <option value="sunglasses">Sunglasses</option>
                      <option value="computer_glasses">Computer Glasses</option>
                      <option value="contact_lenses">Contact Lenses</option>
                    </select>
                  </div>

                  {isContactLens ? (
                    <>
                      <div>
                        <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-1.5">Lens Type</label>
                        <select
                          value={lensTypeParam}
                          onChange={(e) => updateFilter('lens_type', e.target.value)}
                          className="w-full border border-gray-200 rounded-lg p-2.5 text-xs text-gray-800 bg-gray-50 focus:outline-none"
                        >
                          <option value="">All Lens Types</option>
                          <option value="spherical">Spherical</option>
                          <option value="toric">Toric</option>
                          <option value="multifocal">Multifocal</option>
                          <option value="colored">Colored</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-1.5">Wear Duration</label>
                        <select
                          value={wearDurationParam}
                          onChange={(e) => updateFilter('wear_duration', e.target.value)}
                          className="w-full border border-gray-200 rounded-lg p-2.5 text-xs text-gray-800 bg-gray-50 focus:outline-none"
                        >
                          <option value="">All Durations</option>
                          <option value="daily">Daily Disposables</option>
                          <option value="monthly">Monthly Disposable</option>
                          <option value="yearly">Yearly Conventional</option>
                        </select>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-1.5">Frame Shape</label>
                        <select
                          value={shapeParam}
                          onChange={(e) => updateFilter('shape', e.target.value)}
                          className="w-full border border-gray-200 rounded-lg p-2.5 text-xs text-gray-800 bg-gray-50 focus:outline-none capitalize"
                        >
                          <option value="">All Shapes</option>
                          {filterOptions.shapes.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-1.5">Frame Size</label>
                        <select
                          value={sizeParam}
                          onChange={(e) => updateFilter('size', e.target.value)}
                          className="w-full border border-gray-200 rounded-lg p-2.5 text-xs text-gray-800 bg-gray-50 focus:outline-none capitalize"
                        >
                          <option value="">All Sizes</option>
                          {filterOptions.sizes.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-1.5">Brand</label>
                    <select
                      value={brandParam}
                      onChange={(e) => updateFilter('brand', e.target.value)}
                      className="w-full border border-gray-200 rounded-lg p-2.5 text-xs text-gray-800 bg-gray-50 focus:outline-none"
                    >
                      <option value="">All Brands</option>
                      {filterOptions.brands.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Drawer Footer */}
                <div className="p-4 border-t border-gray-200 flex gap-2">
                  <button
                    onClick={() => {
                      clearAllFilters();
                      setMobileFilterOpen(false);
                    }}
                    className="w-1/2 py-2.5 border border-gray-200 text-xs font-bold text-gray-700 rounded-lg"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="w-1/2 py-2.5 bg-secondary text-white text-xs font-bold rounded-lg shadow-sm"
                  >
                    Apply
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default Products;
