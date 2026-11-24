import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { motion } from 'framer-motion';
import { siteConfig } from '../config/siteConfig';
import { 
  FaTruck, FaStore, FaFileMedical, FaKeyboard, 
  FaTimesCircle, FaMoneyBillWave, FaQrcode, FaCheck, FaExclamationCircle 
} from 'react-icons/fa';

const Checkout = () => {
  const [items, setItems] = useState([]);
  const [address, setAddress] = useState('');
  const [mobile, setMobile] = useState('');
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Delivery state
  const [deliveryType, setDeliveryType] = useState('DELIVERY'); // 'DELIVERY' or 'PICKUP'

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState('COD'); // 'COD' or 'UPI'
  const [utrNumber, setUtrNumber] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Prescription state
  const [prescriptionOption, setPrescriptionOption] = useState('none'); // 'none', 'file', 'manual'
  const [odSph, setOdSph] = useState('0.00');
  const [odCyl, setOdCyl] = useState('0.00');
  const [odAxis, setOdAxis] = useState('');
  const [odAdd, setOdAdd] = useState('0.00');

  const [osSph, setOsSph] = useState('0.00');
  const [osCyl, setOsCyl] = useState('0.00');
  const [osAxis, setOsAxis] = useState('');
  const [osAdd, setOsAdd] = useState('0.00');

  const [pd, setPd] = useState('63');

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

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(siteConfig.upiId || 'maxvision@upi');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Pre-flight validation
    if (deliveryType === 'DELIVERY' && !address.trim()) {
      setErrorMessage('Please enter your full delivery address.');
      return;
    }

    if (!mobile.trim() || mobile.trim().length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (paymentMethod === 'UPI' && (!utrNumber.trim() || utrNumber.trim().length < 6)) {
      setErrorMessage('Please enter your 12-digit UPI Reference / UTR Number after completing payment.');
      return;
    }

    if (prescriptionOption === 'file' && !prescriptionFile) {
      setErrorMessage('Please choose a prescription file or switch to another prescription option.');
      return;
    }

    if (prescriptionOption === 'manual') {
      if (parseFloat(odCyl) !== 0 && (!odAxis || parseInt(odAxis) <= 0 || parseInt(odAxis) > 180)) {
        setErrorMessage('Right Eye (OD) AXIS is required (1° to 180°) when Cylinder (CYL) is set.');
        return;
      }
      if (parseFloat(osCyl) !== 0 && (!osAxis || parseInt(osAxis) <= 0 || parseInt(osAxis) > 180)) {
        setErrorMessage('Left Eye (OS) AXIS is required (1° to 180°) when Cylinder (CYL) is set.');
        return;
      }
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('address', deliveryType === 'PICKUP' ? siteConfig.pickupAddress : address);
    formData.append('mobile', mobile);
    formData.append('delivery_type', deliveryType);
    formData.append('payment_method', paymentMethod);
    if (paymentMethod === 'UPI') {
      formData.append('utr_number', utrNumber);
    }
    formData.append('prescription_option', prescriptionOption);

    if (prescriptionOption === 'file' && prescriptionFile) {
      formData.append('prescription_file', prescriptionFile);
    } else if (prescriptionOption === 'manual') {
      formData.append('od_sph', odSph);
      formData.append('od_cyl', odCyl);
      formData.append('od_axis', odAxis || 0);
      formData.append('od_add', odAdd);

      formData.append('os_sph', osSph);
      formData.append('os_cyl', osCyl);
      formData.append('os_axis', osAxis || 0);
      formData.append('os_add', osAdd);

      if (pd) formData.append('pd', pd);
    }

    try {
      await axios.post('checkout/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/orders', { state: { success: true } });
    } catch (error) {
      console.error(error);
      const serverErr = error.response?.data?.error || error.response?.data?.detail || 'Checkout failed. Please check your inputs and try again.';
      setErrorMessage(serverErr);
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const itemsTotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const deliveryCharge = deliveryType === 'PICKUP' ? 0 : (siteConfig.deliveryCharge || 0);
  const totalAmount = itemsTotal + deliveryCharge;

  // Options for Power Step selects (-10 to +10 in 0.25 steps)
  const powerOptions = [];
  for (let p = -10.0; p <= 10.05; p += 0.25) {
    const val = (p > 0 ? `+${p.toFixed(2)}` : p === 0 ? '0.00' : p.toFixed(2));
    powerOptions.push(val);
  }

  const addOptions = ['0.00', '+0.75', '+1.00', '+1.25', '+1.50', '+1.75', '+2.00', '+2.25', '+2.50', '+2.75', '+3.00', '+3.50', '+4.00'];

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12 flex flex-col lg:flex-row gap-8">
      {/* Checkout Form */}
      <div className="w-full lg:w-2/3 bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-150">
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-6 text-primary border-b pb-4">
          Complete Your Order
        </h1>

        {errorMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -8 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-start gap-3"
          >
            <FaExclamationCircle className="text-red-500 mt-0.5 flex-shrink-0" size={18} />
            <div className="text-sm font-medium">{errorMessage}</div>
          </motion.div>
        )}

        <form onSubmit={handleCheckout} className="space-y-8">
          
          {/* Section 1: Delivery Mode */}
          <div>
            <h2 className="text-lg font-bold text-primary mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-secondary text-white text-xs flex items-center justify-center font-bold">1</span>
              Delivery Option
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label 
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  deliveryType === 'DELIVERY' 
                    ? 'border-secondary bg-teal-50/50 shadow-sm' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input 
                  type="radio" 
                  name="delivery_type" 
                  value="DELIVERY" 
                  checked={deliveryType === 'DELIVERY'} 
                  onChange={() => setDeliveryType('DELIVERY')} 
                  className="mt-1 accent-secondary"
                />
                <div>
                  <div className="font-bold text-primary flex items-center gap-2">
                    <FaTruck className="text-secondary" /> Home Delivery
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Delivered securely to your doorstep across India.</p>
                  <div className="text-xs font-semibold text-green-700 mt-2">FREE Delivery</div>
                </div>
              </label>

              <label 
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  deliveryType === 'PICKUP' 
                    ? 'border-secondary bg-teal-50/50 shadow-sm' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input 
                  type="radio" 
                  name="delivery_type" 
                  value="PICKUP" 
                  checked={deliveryType === 'PICKUP'} 
                  onChange={() => setDeliveryType('PICKUP')} 
                  className="mt-1 accent-secondary"
                />
                <div>
                  <div className="font-bold text-primary flex items-center gap-2">
                    <FaStore className="text-secondary" /> Store Pickup (Ranchi)
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Pick up directly from our flagship optical store.</p>
                  <div className="text-xs font-semibold text-secondary mt-2">Ready in 2-3 Days</div>
                </div>
              </label>
            </div>

            {deliveryType === 'PICKUP' && (
              <div className="mt-4 p-4 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-3">
                <FaStore className="text-blue-600 mt-0.5 flex-shrink-0" size={16} />
                <div>
                  <div className="font-bold">Pickup Store Location:</div>
                  <div className="mt-0.5">{siteConfig.pickupAddress}</div>
                  <div className="mt-1 font-semibold text-blue-800">Store Hours: {siteConfig.hours} | Phone: {siteConfig.primaryPhone}</div>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Contact & Address */}
          <div>
            <h2 className="text-lg font-bold text-primary mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-secondary text-white text-xs flex items-center justify-center font-bold">2</span>
              Contact & Address
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">10-Digit Mobile Number *</label>
                <input 
                  type="tel" 
                  required
                  maxLength="10"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 7485067874"
                  className="w-full border border-gray-300 rounded-lg p-3 text-base focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                />
                <span className="text-xs text-gray-400">Order updates and delivery status will be sent here.</span>
              </div>

              {deliveryType === 'DELIVERY' && (
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Delivery Address *</label>
                  <textarea 
                    rows="3" 
                    required={deliveryType === 'DELIVERY'}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House/Flat No., Building Name, Street, Landmark, City, State, Pincode"
                    className="w-full border border-gray-300 rounded-lg p-3 text-base focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                  ></textarea>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Prescription Details */}
          <div>
            <h2 className="text-lg font-bold text-primary mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-secondary text-white text-xs flex items-center justify-center font-bold">3</span>
              Prescription Details
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <label 
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all text-center flex flex-col items-center justify-center gap-1.5 ${
                  prescriptionOption === 'none' 
                    ? 'border-secondary bg-teal-50/50 text-secondary font-bold' 
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <input 
                  type="radio" 
                  name="presc_opt" 
                  value="none" 
                  checked={prescriptionOption === 'none'} 
                  onChange={() => setPrescriptionOption('none')}
                  className="sr-only"
                />
                <FaTimesCircle size={20} />
                <span className="text-xs font-semibold">Not Needed / Frame Only</span>
              </label>

              <label 
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all text-center flex flex-col items-center justify-center gap-1.5 ${
                  prescriptionOption === 'file' 
                    ? 'border-secondary bg-teal-50/50 text-secondary font-bold' 
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <input 
                  type="radio" 
                  name="presc_opt" 
                  value="file" 
                  checked={prescriptionOption === 'file'} 
                  onChange={() => setPrescriptionOption('file')}
                  className="sr-only"
                />
                <FaFileMedical size={20} />
                <span className="text-xs font-semibold">Upload Photo / PDF</span>
              </label>

              <label 
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all text-center flex flex-col items-center justify-center gap-1.5 ${
                  prescriptionOption === 'manual' 
                    ? 'border-secondary bg-teal-50/50 text-secondary font-bold' 
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <input 
                  type="radio" 
                  name="presc_opt" 
                  value="manual" 
                  checked={prescriptionOption === 'manual'} 
                  onChange={() => setPrescriptionOption('manual')}
                  className="sr-only"
                />
                <FaKeyboard size={20} />
                <span className="text-xs font-semibold">Enter Power Manually</span>
              </label>
            </div>

            {/* Upload File Input */}
            {prescriptionOption === 'file' && (
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <label className="block text-xs font-semibold mb-2 text-gray-700">Choose Prescription Document (PDF, JPG, PNG)</label>
                <input 
                  type="file" 
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setPrescriptionFile(e.target.files[0])}
                  className="w-full text-sm text-gray-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-secondary file:text-white hover:file:bg-teal-600 cursor-pointer"
                />
                <p className="text-xs text-gray-400 mt-2">Our certified optometrist will review your prescription before crafting lenses.</p>
              </div>
            )}

            {/* Manual Form */}
            {prescriptionOption === 'manual' && (
              <div className="p-4 sm:p-5 rounded-xl bg-gray-50 border border-gray-200 space-y-4">
                <div className="text-xs font-bold uppercase text-gray-500 tracking-wider">Eye Power Specifications</div>
                
                {/* Responsive Power Grid */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-500">
                        <th className="py-2 pr-3">Eye</th>
                        <th className="py-2 px-2">SPH (Sphere)</th>
                        <th className="py-2 px-2">CYL (Cylinder)</th>
                        <th className="py-2 px-2">AXIS (0-180°)</th>
                        <th className="py-2 pl-2">ADD (Near)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {/* Right Eye (OD) */}
                      <tr>
                        <td className="py-3 pr-3 font-bold text-primary">OD (Right)</td>
                        <td className="py-2 px-1">
                          <select 
                            value={odSph} 
                            onChange={(e) => setOdSph(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded bg-white font-medium"
                          >
                            {powerOptions.map(opt => <option key={`od-sph-${opt}`} value={opt}>{opt}</option>)}
                          </select>
                        </td>
                        <td className="py-2 px-1">
                          <select 
                            value={odCyl} 
                            onChange={(e) => setOdCyl(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded bg-white font-medium"
                          >
                            {powerOptions.map(opt => <option key={`od-cyl-${opt}`} value={opt}>{opt}</option>)}
                          </select>
                        </td>
                        <td className="py-2 px-1">
                          <input 
                            type="number" 
                            min="0" 
                            max="180" 
                            value={odAxis} 
                            onChange={(e) => setOdAxis(e.target.value)}
                            placeholder="0-180"
                            className="w-full p-2 border border-gray-300 rounded bg-white font-medium text-center"
                          />
                        </td>
                        <td className="py-2 pl-1">
                          <select 
                            value={odAdd} 
                            onChange={(e) => setOdAdd(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded bg-white font-medium"
                          >
                            {addOptions.map(opt => <option key={`od-add-${opt}`} value={opt}>{opt}</option>)}
                          </select>
                        </td>
                      </tr>

                      {/* Left Eye (OS) */}
                      <tr>
                        <td className="py-3 pr-3 font-bold text-primary">OS (Left)</td>
                        <td className="py-2 px-1">
                          <select 
                            value={osSph} 
                            onChange={(e) => setOsSph(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded bg-white font-medium"
                          >
                            {powerOptions.map(opt => <option key={`os-sph-${opt}`} value={opt}>{opt}</option>)}
                          </select>
                        </td>
                        <td className="py-2 px-1">
                          <select 
                            value={osCyl} 
                            onChange={(e) => setOsCyl(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded bg-white font-medium"
                          >
                            {powerOptions.map(opt => <option key={`os-cyl-${opt}`} value={opt}>{opt}</option>)}
                          </select>
                        </td>
                        <td className="py-2 px-1">
                          <input 
                            type="number" 
                            min="0" 
                            max="180" 
                            value={osAxis} 
                            onChange={(e) => setOsAxis(e.target.value)}
                            placeholder="0-180"
                            className="w-full p-2 border border-gray-300 rounded bg-white font-medium text-center"
                          />
                        </td>
                        <td className="py-2 pl-1">
                          <select 
                            value={osAdd} 
                            onChange={(e) => setOsAdd(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded bg-white font-medium"
                          >
                            {addOptions.map(opt => <option key={`os-add-${opt}`} value={opt}>{opt}</option>)}
                          </select>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* PD Input */}
                <div className="pt-2 flex items-center gap-3">
                  <label className="text-xs font-semibold text-gray-700 whitespace-nowrap">Pupillary Distance (PD):</label>
                  <input 
                    type="number" 
                    min="50" 
                    max="80" 
                    value={pd} 
                    onChange={(e) => setPd(e.target.value)}
                    className="w-20 p-2 border border-gray-300 rounded bg-white font-medium text-center text-xs"
                  />
                  <span className="text-xs text-gray-500">mm (Default: 63mm)</span>
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Payment Option */}
          <div>
            <h2 className="text-lg font-bold text-primary mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-secondary text-white text-xs flex items-center justify-center font-bold">4</span>
              Payment Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label 
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  paymentMethod === 'COD' 
                    ? 'border-secondary bg-teal-50/50 shadow-sm' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input 
                  type="radio" 
                  name="payment_method" 
                  value="COD" 
                  checked={paymentMethod === 'COD'} 
                  onChange={() => setPaymentMethod('COD')}
                  className="mt-1 accent-secondary"
                />
                <div>
                  <div className="font-bold text-primary flex items-center gap-2">
                    <FaMoneyBillWave className="text-secondary" /> Cash on Delivery (COD)
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Pay with cash or UPI at the time of delivery or store pickup.</p>
                </div>
              </label>

              <label 
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  paymentMethod === 'UPI' 
                    ? 'border-secondary bg-teal-50/50 shadow-sm' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input 
                  type="radio" 
                  name="payment_method" 
                  value="UPI" 
                  checked={paymentMethod === 'UPI'} 
                  onChange={() => setPaymentMethod('UPI')}
                  className="mt-1 accent-secondary"
                />
                <div>
                  <div className="font-bold text-primary flex items-center gap-2">
                    <FaQrcode className="text-secondary" /> UPI / QR Payment
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Instant payment via GPay, PhonePe, Paytm, or BHIM.</p>
                </div>
              </label>
            </div>

            {paymentMethod === 'UPI' && (
              <div className="mt-4 p-5 rounded-xl bg-teal-50/60 border border-teal-200 space-y-3">
                <div className="text-xs font-bold text-teal-900 uppercase tracking-wider">Direct UPI Transfer</div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-lg border border-teal-200">
                  <div>
                    <span className="text-xs text-gray-400 block font-semibold">MAXVISION Store UPI ID</span>
                    <span className="text-base font-extrabold text-primary font-mono">{siteConfig.upiId}</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={handleCopyUpi}
                    className="min-h-[44px] px-4 py-2 bg-secondary text-white rounded-lg text-xs font-bold hover:bg-teal-600 transition-colors flex items-center justify-center gap-1.5"
                  >
                    {copiedUpi ? <><FaCheck /> Copied</> : 'Copy UPI ID'}
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    12-Digit UPI Reference / UTR Number *
                  </label>
                  <input 
                    type="text" 
                    maxLength="25"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value.trim())}
                    placeholder="e.g. 412384918234"
                    className="w-full border border-gray-300 rounded-lg p-3 text-base focus:outline-none focus:ring-2 focus:ring-secondary font-mono"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    After completing the transfer in your UPI app, paste the 12-digit transaction UTR number here.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Place Order CTA Button */}
          <motion.button 
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            type="submit"
            className={`w-full min-h-[52px] text-white font-bold py-4 rounded-xl transition-all shadow-md text-lg flex items-center justify-center gap-2 ${
              loading ? 'bg-teal-400 cursor-not-allowed' : 'bg-secondary hover:bg-teal-600'
            }`}
          >
            {loading ? (
              <><span className="animate-spin text-xl">◌</span> Processing Order...</>
            ) : (
              `Place Order securely (₹${totalAmount})`
            )}
          </motion.button>
        </form>
      </div>

      {/* Order Summary Sidebar */}
      <div className="w-full lg:w-1/3">
        <div className="bg-light p-6 rounded-xl border border-gray-200 sticky top-24 space-y-6">
          <h3 className="text-xl font-bold text-primary border-b pb-3">Order Summary</h3>
          
          <div className="space-y-4 max-h-80 overflow-y-auto divide-y divide-gray-150 pr-1">
            {items.map(item => (
              <div key={item.id} className="pt-3 first:pt-0">
                <div className="flex justify-between items-start text-sm">
                  <div className="w-3/4">
                    <span className="font-bold text-primary block truncate">{item.product.name}</span>
                    <span className="text-xs text-gray-500 block">
                      Qty: {item.quantity} | {item.lens_package.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <span className="font-extrabold text-primary">₹{item.subtotal}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2.5 pt-4 border-t border-gray-200 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Items Total</span>
              <span className="font-semibold">₹{itemsTotal}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Charges</span>
              <span className="font-semibold text-green-700">
                {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Payment Mode</span>
              <span className="font-semibold">{paymentMethod === 'UPI' ? 'UPI / QR' : 'Cash on Delivery'}</span>
            </div>
            <div className="border-t border-gray-300 pt-3 flex justify-between items-center font-extrabold text-2xl text-primary">
              <span>Total</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>

          <div className="bg-white p-3 rounded-lg border border-gray-200 text-xs text-gray-500 space-y-1">
            <div className="font-bold text-gray-700">MAXVISION Ranchi Store Guarantee:</div>
            <div>• Free eye checkup included on all frame purchases</div>
            <div>• 100% genuine lenses with UV & Blu Cut coating</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

