import React, { useState } from 'react';
import axios from '../api/axios';
import { FaHome, FaCheckCircle, FaCalendarAlt, FaPhoneAlt, FaMapMarkerAlt, FaUser } from 'react-icons/fa';

const TryAtHome = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    preferred_date: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setErrorMsg('Please fill in your name, phone number, and address.');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post('home-visit/', {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        preferred_date: formData.preferred_date || null,
        notes: formData.notes.trim() || ''
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Home visit request error', err);
      setErrorMsg('Could not submit request right now. Please call us directly at 7485067874.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        
        {/* Intro Banner */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <FaHome />
            <span>Doorstep Optical Service In Ranchi</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-primary tracking-tight mb-2">
            Book Free Try @ Home
          </h1>
          <p className="text-xs md:text-sm text-gray-600">
            Our certified optical specialist will bring 50+ trending frames and computerized eye-testing equipment straight to your doorstep across Ranchi.
          </p>
        </div>

        {/* 3 Step Process */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl border border-gray-200 text-center shadow-2xs">
            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-black text-xs mx-auto mb-2">1</div>
            <h4 className="text-xs font-bold text-primary mb-1">Book Your Date</h4>
            <p className="text-[11px] text-gray-500">Pick a convenient date and location in Ranchi.</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 text-center shadow-2xs">
            <div className="w-8 h-8 bg-secondary text-white rounded-full flex items-center justify-center font-black text-xs mx-auto mb-2">2</div>
            <h4 className="text-xs font-bold text-primary mb-1">50+ Frames at Home</h4>
            <p className="text-[11px] text-gray-500">Try on frames with your family in natural lighting.</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 text-center shadow-2xs">
            <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-black text-xs mx-auto mb-2">3</div>
            <h4 className="text-xs font-bold text-primary mb-1">Free Eye Testing</h4>
            <p className="text-[11px] text-gray-500">Accurate vision checkup and customized lens selection.</p>
          </div>
        </div>

        {/* Form Card or Success Message */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle size={32} />
              </div>
              <h2 className="text-xl md:text-2xl font-black text-primary mb-2">
                Home Visit Request Received!
              </h2>
              <p className="text-xs md:text-sm text-gray-600 max-w-md mx-auto mb-6">
                Thank you, <strong>{formData.name}</strong>. Our Ranchi optical coordinator will call you at <strong>{formData.phone}</strong> shortly to confirm the scheduled visit.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', phone: '', address: '', preferred_date: '', notes: '' });
                }}
                className="bg-primary text-white text-xs font-bold px-6 py-2.5 rounded-lg hover:bg-opacity-90 transition-all shadow-sm"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-base md:text-lg font-bold text-primary border-b border-gray-100 pb-3">
                Request Doorstep Visit
              </h3>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Rahul Kumar"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-secondary"
                    />
                    <FaUser className="absolute left-3 top-3 text-gray-400 text-xs" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number (10 digits) *</label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-secondary"
                    />
                    <FaPhoneAlt className="absolute left-3 top-3 text-gray-400 text-xs" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Complete Address in Ranchi *</label>
                <div className="relative">
                  <textarea
                    name="address"
                    required
                    rows="2"
                    placeholder="House / Flat No., Road, Landmark, Area in Ranchi (e.g. Main Road, Lalpur, Doranda)"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-secondary"
                  />
                  <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400 text-xs" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Preferred Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="preferred_date"
                      value={formData.preferred_date}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-secondary"
                    />
                    <FaCalendarAlt className="absolute left-3 top-3 text-gray-400 text-xs" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Notes / Preferences (Optional)</label>
                  <input
                    type="text"
                    name="notes"
                    placeholder="e.g. Prefer titanium frames, computer glasses"
                    value={formData.notes}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-secondary"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-secondary hover:bg-opacity-90 text-white font-bold text-xs md:text-sm py-3 rounded-lg transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  {submitting ? 'Submitting Request...' : 'Confirm Book Free Try @ Home'}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default TryAtHome;

