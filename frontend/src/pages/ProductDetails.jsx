import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaStar, FaShippingFast } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lensPackage, setLensPackage] = useState('frame_only');
  const [isAdding, setIsAdding] = useState(false);
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

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    setIsAdding(true);
    try {
      await axios.post('cart/', {
        product_id: product.id,
        lens_package: lensPackage
      });
      // Mock animation delay
      setTimeout(() => {
        setIsAdding(false);
        navigate('/cart');
      }, 600);
    } catch (error) {
      console.error("Failed to add to cart", error);
      setIsAdding(false);
    }
  };

  const checkDelivery = () => {
    if(pincode.length === 6) {
      setDeliveryStatus('Delivery by ' + new Date(Date.now() + 3*24*60*60*1000).toDateString());
    } else {
      setDeliveryStatus('Invalid Pincode');
    }
  }

  if (loading) return <div className="text-center py-20 text-xl font-bold">Loading Premium Experience...</div>;
  if (!product) return <div className="text-center py-20 text-xl">Product Not Found</div>;

  const discountedPrice = product.price * (1 - product.discount_percentage / 100);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row gap-12">
        
        {/* Left: Image Viewer (with basic zoom hover effect) */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-light rounded-xl overflow-hidden group">
          <motion.img 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            src={product.image || "https://static5.lenskart.com/media/catalog/product/pro/1/thumbnail/628x301/9df78eab33525d08d6e5fb8d27136e95//v/i/vincent-chase-vc-e13028-c2-eyeglasses_G_7200.jpg"} 
            alt={product.name} 
            className="w-full h-auto object-contain mix-blend-multiply group-hover:scale-125 transition-transform duration-500 cursor-zoom-in"
          />
        </div>

        {/* Right: Product Details */}
        <div className="w-full md:w-1/2">
          <h3 className="text-sm text-gray-500 uppercase tracking-widest mb-2">{product.brand || 'MAXVISION Exclusive'}</h3>
          <h1 className="text-3xl font-extrabold text-primary mb-2">{product.name}</h1>
          <div className="flex items-center gap-2 mb-6 text-accent">
            <FaStar /><FaStar /><FaStar /><FaStar /><FaStar className="text-gray-300"/>
            <span className="text-gray-500 text-sm ml-2">(128 Reviews)</span>
          </div>

          <p className="text-gray-600 mb-6">{product.description}</p>

          <div className="mb-8">
            <span className="text-4xl font-extrabold text-secondary">₹{discountedPrice.toFixed(0)}</span>
            {product.discount_percentage > 0 && (
              <>
                <span className="text-xl text-gray-400 line-through ml-3">₹{product.price.toFixed(0)}</span>
                <span className="ml-3 text-green-600 font-bold bg-green-100 px-2 py-1 rounded text-sm">
                  {product.discount_percentage}% OFF
                </span>
              </>
            )}
            <p className="text-xs text-gray-400 mt-1">Inclusive of all taxes</p>
          </div>

          {/* Delivery Checker */}
          <div className="mb-8 bg-light p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FaShippingFast className="text-gray-500"/>
              <span className="font-semibold">Check Delivery Option</span>
            </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                maxLength="6"
                placeholder="Enter Pincode" 
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 flex-grow focus:outline-none focus:border-secondary"
              />
              <button onClick={checkDelivery} className="bg-gray-800 text-white px-4 rounded hover:bg-gray-700">Check</button>
            </div>
            {deliveryStatus && <p className={`mt-2 text-sm ${deliveryStatus.includes('Invalid') ? 'text-red-500' : 'text-green-600'}`}>{deliveryStatus}</p>}
          </div>

          {/* Specs */}
          <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
            <div><span className="text-gray-500">Shape:</span> <span className="font-semibold capitalize">{product.frame_shape}</span></div>
            <div><span className="text-gray-500">Size:</span> <span className="font-semibold capitalize">{product.frame_size}</span></div>
            <div><span className="text-gray-500">Color:</span> <span className="font-semibold capitalize">{product.frame_color}</span></div>
            <div><span className="text-gray-500">Material:</span> <span className="font-semibold">{product.material || 'Premium Polycarbonate'}</span></div>
          </div>

          {/* Lens Selection (if applicable) */}
          {product.category !== 'sunglasses' && product.category !== 'contact_lenses' && (
            <div className="mb-8">
              <h4 className="font-bold mb-4">Select Lens Package</h4>
              <div className="space-y-3">
                {[
                  { id: 'frame_only', label: 'Frame Only', price: 0 },
                  { id: 'zero_power', label: 'Zero Power (Blu Cut)', price: 300, desc: 'For screen protection' },
                  { id: 'single_vision', label: 'Single Vision (Anti-Glare)', price: 500, desc: 'For distant or near vision' },
                  { id: 'bifocal', label: 'Bifocal / Progressive', price: 1500, desc: 'For both distant & near vision' },
                ].map(pkg => (
                  <label key={pkg.id} className={`flex items-start justify-between p-4 border rounded-lg cursor-pointer transition-colors ${lensPackage === pkg.id ? 'border-secondary bg-teal-50' : 'border-gray-200 hover:border-secondary'}`}>
                    <div className="flex gap-3">
                      <input 
                        type="radio" 
                        name="lens_package" 
                        value={pkg.id} 
                        checked={lensPackage === pkg.id} 
                        onChange={(e) => setLensPackage(e.target.value)}
                        className="mt-1 accent-secondary"
                      />
                      <div>
                        <div className="font-bold">{pkg.label}</div>
                        {pkg.desc && <div className="text-xs text-gray-500">{pkg.desc}</div>}
                      </div>
                    </div>
                    <div className="font-bold text-gray-700">+{pkg.price > 0 ? `₹${pkg.price}` : 'Free'}</div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`flex-1 py-4 rounded-lg font-bold text-lg text-white transition-all flex justify-center items-center gap-2 ${isAdding ? 'bg-teal-500' : 'bg-secondary hover:bg-teal-600'}`}
            >
              {isAdding ? <><span className="animate-spin text-xl">◌</span> Adding...</> : 'Add to Cart / Buy Now'}
            </motion.button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
