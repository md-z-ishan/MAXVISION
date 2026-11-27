import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { motion } from 'framer-motion';
import { FaStar, FaShippingFast, FaShieldAlt, FaCheck, FaShoppingCart, FaBolt, FaExclamationTriangle } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { siteConfig } from '../config/siteConfig';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lensPackage, setLensPackage] = useState('frame_only');
  const [isAdding, setIsAdding] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [pincode, setPincode] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState(null);
  const { isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`products/${id}/`);
        setProduct(response.data);
      } catch (error) {
        console.error("Failed to fetch product", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Robust image path resolver for Django media & external URLs
  const getProductImage = (prod) => {
    if (!prod) return "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&h=450&fit=crop&auto=format";
    const raw = prod.image_url || prod.image;
    if (!raw) return "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&h=450&fit=crop&auto=format";
    if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
    if (raw.startsWith('/media/')) return `http://127.0.0.1:8000${raw}`;
    if (raw.startsWith('media/')) return `http://127.0.0.1:8000/${raw}`;
    return `http://127.0.0.1:8000/media/${raw}`;
  };

  const handleAddToCart = async (goToCheckout = false) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (goToCheckout) {
      setIsBuying(true);
    } else {
      setIsAdding(true);
    }

    try {
      await axios.post('cart/', {
        product_id: product.id,
        lens_package: lensPackage
      });
      setTimeout(() => {
        setIsAdding(false);
        setIsBuying(false);
        if (goToCheckout) {
          navigate('/checkout');
        } else {
          navigate('/cart');
        }
      }, 400);
    } catch (error) {
      console.error("Failed to add to cart", error);
      setIsAdding(false);
      setIsBuying(false);
    }
  };

  const checkDelivery = () => {
    const cleanPin = pincode.trim();
    if (!cleanPin || cleanPin.length !== 6 || !/^\d{6}$/.test(cleanPin)) {
      setDeliveryStatus({
        type: 'error',
        message: 'Please enter a valid 6-digit pincode.'
      });
      return;
    }
    
    const allowed = siteConfig.allowedPincodes || ['834001', '834002'];
    if (allowed.includes(cleanPin)) {
      setDeliveryStatus({
        type: 'success',
        message: `✓ Delivery Available in Ranchi (${cleanPin}) - Free Doorstep Delivery in 2-3 Days.`
      });
    } else {
      setDeliveryStatus({
        type: 'error',
        message: `✕ Delivery not available for ${cleanPin}. We deliver ONLY to Ranchi pincodes 834001 and 834002.`
      });
    }
  };

  if (loading) return (
    <div className="container mx-auto px-4 py-24 text-center">
      <div className="inline-block animate-spin text-3xl text-secondary mb-4">◌</div>
      <div className="text-xl font-bold text-primary">Loading Premium Eyewear Experience...</div>
    </div>
  );

  if (!product) return (
    <div className="container mx-auto px-4 py-24 text-center">
      <h2 className="text-2xl font-black text-primary mb-3">Product Not Found</h2>
      <p className="text-gray-500 mb-6">The requested product could not be located in our catalog.</p>
      <button onClick={() => navigate('/products')} className="bg-secondary text-white px-6 py-2.5 rounded-lg font-bold">
        Back to Catalog
      </button>
    </div>
  );

  const discountedPrice = product.price * (1 - product.discount_percentage / 100);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 md:py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-150 p-4 sm:p-6 md:p-8 flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
        
        {/* Left: Product Image Showcase */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-gray-50/80 rounded-2xl p-4 sm:p-8 border border-gray-150 min-h-[300px] sm:min-h-[380px] md:min-h-[460px] self-start md:sticky md:top-24 overflow-hidden group">
          <img 
            src={getProductImage(product)} 
            alt={product.name} 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=450&fit=crop";
            }}
            className="w-full max-h-[280px] sm:max-h-[340px] md:max-h-[400px] object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105 cursor-zoom-in"
          />
          <div className="mt-4 flex items-center gap-1.5 text-xs text-gray-400 font-medium">
            <FaShieldAlt className="text-secondary" />
            <span>100% Authentic Ranchi MAXVISION Store Stock</span>
          </div>
        </div>

        {/* Right: Product Details & Controls */}
        <div className="w-full md:w-1/2 flex flex-col">
          {product.brand && (
            <span className="text-xs font-black text-secondary uppercase tracking-widest mb-1.5">
              {product.brand}
            </span>
          )}
          
          {/* Product Title (Protected against clipping) */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-primary mb-2.5 break-words leading-tight">
            {product.name}
          </h1>

          <div className="flex items-center gap-2 mb-4 text-accent">
            <div className="flex text-amber-400">
              <FaStar /><FaStar /><FaStar /><FaStar /><FaStar className="text-gray-300"/>
            </div>
            <span className="text-gray-500 text-xs sm:text-sm font-semibold">(128 Verified Ratings)</span>
          </div>

          <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">{product.description}</p>

          {/* Pricing & Stock status */}
          <div className="mb-6 p-4 rounded-xl bg-gray-50/70 border border-gray-150">
            <div className="flex items-baseline flex-wrap gap-2.5">
              <span className="text-3xl sm:text-4xl font-black text-secondary">₹{discountedPrice.toFixed(0)}</span>
              {product.discount_percentage > 0 && (
                <>
                  <span className="text-lg sm:text-xl text-gray-400 line-through">₹{product.price.toFixed(0)}</span>
                  <span className="text-emerald-700 font-extrabold bg-emerald-100 px-2 py-0.5 rounded text-xs">
                    {product.discount_percentage}% OFF
                  </span>
                </>
              )}
              {product.stock_quantity <= 0 ? (
                <span className="text-red-700 font-extrabold bg-red-100 px-2.5 py-1 rounded text-xs">
                  Out of Stock
                </span>
              ) : product.stock_quantity <= 5 ? (
                <span className="text-amber-800 font-bold bg-amber-100 px-2.5 py-1 rounded text-xs">
                  Only {product.stock_quantity} left in Ranchi stock!
                </span>
              ) : (
                <span className="text-teal-700 font-bold bg-teal-50 px-2.5 py-1 rounded text-xs">
                  In Stock ({product.stock_quantity} available)
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-400 mt-1.5 font-medium">Inclusive of all GST & taxes</p>
          </div>

          {/* Delivery Pincode Checker (Ranchi 834001 & 834002 Only) */}
          <div className="mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <FaShippingFast className="text-secondary" />
                <span className="font-bold text-sm text-primary">Check Delivery Eligibility</span>
              </div>
              <span className="text-[11px] font-bold text-secondary bg-teal-50 px-2 py-0.5 rounded">
                Ranchi Exclusive
              </span>
            </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                maxLength="6"
                placeholder="Enter 6-digit Pincode (e.g. 834001)" 
                value={pincode}
                onChange={(e) => {
                  setPincode(e.target.value.replace(/\D/g, ''));
                  if (deliveryStatus) setDeliveryStatus(null);
                }}
                onKeyDown={(e) => e.key === 'Enter' && checkDelivery()}
                className="border border-gray-300 rounded-lg px-3.5 py-2 text-sm flex-grow focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
              />
              <button 
                type="button"
                onClick={checkDelivery} 
                className="bg-primary hover:bg-slate-800 text-white px-5 min-h-[42px] rounded-lg font-bold text-sm transition-colors cursor-pointer"
              >
                Check
              </button>
            </div>
            {deliveryStatus && (
              <div className={`mt-2.5 p-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 ${
                deliveryStatus.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {deliveryStatus.type === 'success' ? <FaCheck className="shrink-0 text-emerald-600" /> : <FaExclamationTriangle className="shrink-0 text-red-500" />}
                <span>{deliveryStatus.message}</span>
              </div>
            )}
            <p className="text-[11px] text-gray-500 mt-2">
              Doorstep Delivery available only for <strong>834001</strong> & <strong>834002</strong>. Free Store Pickup at Main Road Ranchi available for all.
            </p>
          </div>

          {/* Product Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 p-3.5 bg-gray-50/60 rounded-xl border border-gray-150 text-xs">
            <div>
              <span className="text-gray-400 block font-medium">Shape</span>
              <span className="font-extrabold text-primary capitalize">{product.frame_shape || 'Standard'}</span>
            </div>
            <div>
              <span className="text-gray-400 block font-medium">Size</span>
              <span className="font-extrabold text-primary capitalize">{product.frame_size || 'Medium'}</span>
            </div>
            <div>
              <span className="text-gray-400 block font-medium">Color</span>
              <span className="font-extrabold text-primary capitalize">{product.frame_color || 'Classic'}</span>
            </div>
            <div>
              <span className="text-gray-400 block font-medium">Material</span>
              <span className="font-extrabold text-primary">{product.material || 'Acetate / Metal'}</span>
            </div>
          </div>

          {/* Lens Selection (if applicable) */}
          {product.category !== 'sunglasses' && product.category !== 'contact_lenses' && (
            <div className="mb-6">
              <h4 className="font-black text-sm text-primary mb-3 uppercase tracking-wider">
                Select Lens Package
              </h4>
              <div className="space-y-2.5">
                {[
                  { id: 'frame_only', label: 'Frame Only', price: 0, desc: 'Original demo lenses' },
                  { id: 'zero_power', label: 'Zero Power (Blu Cut)', price: 300, desc: 'Anti-blue light for screens' },
                  { id: 'single_vision', label: 'Single Vision (Anti-Glare)', price: 500, desc: 'Distance or reading power' },
                  { id: 'bifocal', label: 'Bifocal / Progressive', price: 1500, desc: 'Dual power without line' },
                ].map(pkg => (
                  <label 
                    key={pkg.id} 
                    className={`flex items-start justify-between p-3.5 border-2 rounded-xl cursor-pointer transition-all ${
                      lensPackage === pkg.id 
                        ? 'border-secondary bg-teal-50/50 shadow-2xs' 
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex gap-3 items-start">
                      <input 
                        type="radio" 
                        name="lens_package" 
                        value={pkg.id} 
                        checked={lensPackage === pkg.id} 
                        onChange={(e) => setLensPackage(e.target.value)}
                        className="mt-0.5 accent-secondary"
                      />
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-primary">{pkg.label}</div>
                        {pkg.desc && <div className="text-[11px] text-gray-500">{pkg.desc}</div>}
                      </div>
                    </div>
                    <div className="font-extrabold text-xs sm:text-sm text-primary">
                      +{pkg.price > 0 ? `₹${pkg.price}` : 'Free'}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons: Add to Cart and Buy Now ONLY (WhatsApp enquiry completely removed) */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <motion.button 
              whileTap={{ scale: 0.97 }}
              onClick={() => handleAddToCart(false)}
              disabled={isAdding || isBuying || product.stock_quantity <= 0}
              className={`flex-1 py-3.5 px-6 min-h-[48px] rounded-xl font-extrabold text-sm sm:text-base transition-all flex justify-center items-center gap-2 cursor-pointer ${
                product.stock_quantity <= 0
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed shadow-none'
                  : isAdding
                  ? 'bg-teal-700 text-white'
                  : 'bg-white hover:bg-teal-50 text-secondary border-2 border-secondary shadow-xs'
              }`}
            >
              {isAdding ? (
                <><span className="animate-spin text-lg">◌</span> Adding to Cart...</>
              ) : product.stock_quantity <= 0 ? (
                'Out of Stock'
              ) : (
                <><FaShoppingCart size={16} /> Add to Cart</>
              )}
            </motion.button>

            <motion.button 
              whileTap={{ scale: 0.97 }}
              onClick={() => handleAddToCart(true)}
              disabled={isAdding || isBuying || product.stock_quantity <= 0}
              className={`flex-1 py-3.5 px-6 min-h-[48px] rounded-xl font-extrabold text-sm sm:text-base text-white transition-all flex justify-center items-center gap-2 shadow-md cursor-pointer ${
                product.stock_quantity <= 0
                  ? 'bg-gray-400 cursor-not-allowed shadow-none'
                  : isBuying
                  ? 'bg-teal-700'
                  : 'bg-secondary hover:bg-teal-600'
              }`}
            >
              {isBuying ? (
                <><span className="animate-spin text-lg">◌</span> Proceeding...</>
              ) : (
                <><FaBolt size={16} /> Buy Now</>
              )}
            </motion.button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
