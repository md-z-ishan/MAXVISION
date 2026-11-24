import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../redux/authSlice';
import { FaUser, FaMapMarkerAlt, FaPlus, FaCheck, FaTrash, FaSave } from 'react-icons/fa';

const Profile = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [profileForm, setProfileForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    mobile: ''
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });

  const [addresses, setAddresses] = useState([]);
  const [addressLoading, setAddressLoading] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressError, setAddressError] = useState('');
  const [newAddress, setNewAddress] = useState({
    full_name: '',
    mobile: '',
    street_address: '',
    city: 'Ranchi',
    state: 'Jharkhand',
    pincode: '834001',
    is_default: false
  });

  useEffect(() => {
    if (!isAuthenticated && !localStorage.getItem('access_token')) {
      navigate('/login');
      return;
    }

    const loadProfile = async () => {
      try {
        setProfileLoading(true);
        const res = await axios.get('auth/profile/');
        setProfileForm({
          first_name: res.data.first_name || '',
          last_name: res.data.last_name || '',
          email: res.data.email || '',
          mobile: res.data.mobile || ''
        });
        dispatch(setUser(res.data));
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setProfileLoading(false);
      }
    };

    const loadAddresses = async () => {
      try {
        setAddressLoading(true);
        const res = await axios.get('addresses/');
        setAddresses(res.data || []);
      } catch (err) {
        console.error('Error loading addresses:', err);
      } finally {
        setAddressLoading(false);
      }
    };

    loadProfile();
    loadAddresses();
  }, [isAuthenticated, navigate, dispatch]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: '', text: '' });
    try {
      setProfileLoading(true);
      const res = await axios.patch('auth/profile/', profileForm);
      dispatch(setUser(res.data));
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      const errText = err.response?.data?.error || 'Failed to update profile.';
      setProfileMsg({ type: 'error', text: errText });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleCreateAddress = async (e) => {
    e.preventDefault();
    setAddressError('');
    try {
      const res = await axios.post('addresses/', newAddress);
      setAddresses([...addresses, res.data]);
      setShowAddressModal(false);
      setNewAddress({
        full_name: '',
        mobile: '',
        street_address: '',
        city: 'Ranchi',
        state: 'Jharkhand',
        pincode: '834001',
        is_default: false
      });
    } catch (err) {
      const errDetail = err.response?.data?.error || err.response?.data?.mobile || 'Failed to save address.';
      setAddressError(Array.isArray(errDetail) ? errDetail[0] : errDetail);
    }
  };

  const handleSetDefault = async (addrId) => {
    try {
      await axios.patch(`addresses/${addrId}/`, { is_default: true });
      const res = await axios.get('addresses/');
      setAddresses(res.data || []);
    } catch (err) {
      console.error('Error setting default address:', err);
    }
  };

  const handleDeleteAddress = async (addrId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      await axios.delete(`addresses/${addrId}/`);
      setAddresses(addresses.filter(a => a.id !== addrId));
    } catch (err) {
      console.error('Error deleting address:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-primary">My Account & Profile</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your personal information and delivery addresses</p>
          </div>
          <div className="flex items-center gap-2 bg-teal-50 text-secondary px-4 py-2 rounded-xl font-bold text-sm">
            <FaUser className="text-sm" />
            <span>{user?.username || 'Customer'}</span>
          </div>
        </div>

        {/* Profile Info Form */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-black text-primary mb-6 flex items-center gap-2">
            <span>Personal Information</span>
          </h2>

          {profileMsg.text && (
            <div className={`p-4 rounded-xl text-sm font-semibold mb-6 ${profileMsg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {profileMsg.text}
            </div>
          )}

          <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Username</label>
              <input
                type="text"
                disabled
                value={user?.username || ''}
                className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Email Address</label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition"
                placeholder="name@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">First Name</label>
              <input
                type="text"
                value={profileForm.first_name}
                onChange={(e) => setProfileForm({ ...profileForm, first_name: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition"
                placeholder="First name"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Last Name</label>
              <input
                type="text"
                value={profileForm.last_name}
                onChange={(e) => setProfileForm({ ...profileForm, last_name: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition"
                placeholder="Last name"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Mobile Number (10-digit Indian)</label>
              <input
                type="tel"
                maxLength="10"
                value={profileForm.mobile}
                onChange={(e) => setProfileForm({ ...profileForm, mobile: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition"
                placeholder="e.g. 7485067874"
              />
              <p className="text-xs text-gray-400 mt-1">Starting with 6, 7, 8, or 9</p>
            </div>

            <div className="sm:col-span-2 pt-2">
              <button
                type="submit"
                disabled={profileLoading}
                className="flex items-center justify-center gap-2 bg-secondary text-white font-bold px-6 py-3 rounded-xl hover:bg-teal-600 transition shadow-sm disabled:opacity-50"
              >
                <FaSave />
                <span>{profileLoading ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Address Book */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-black text-primary flex items-center gap-2">
                <FaMapMarkerAlt className="text-secondary" />
                <span>Saved Addresses</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">Use saved addresses during checkout</p>
            </div>
            <button
              onClick={() => setShowAddressModal(true)}
              className="flex items-center gap-2 bg-primary text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-opacity-90 transition shadow-xs"
            >
              <FaPlus size={10} />
              <span>Add New Address</span>
            </button>
          </div>

          {addresses.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-2xl">
              <FaMapMarkerAlt className="mx-auto text-gray-300 text-3xl mb-2" />
              <p className="text-sm font-bold text-gray-500">No saved addresses found</p>
              <p className="text-xs text-gray-400 mt-1">Add your home or office address for faster checkout</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`border rounded-xl p-4 relative transition flex flex-col justify-between ${
                    addr.is_default ? 'border-secondary bg-teal-50/20' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-black text-primary text-sm">{addr.full_name}</span>
                      {addr.is_default && (
                        <span className="text-[10px] font-extrabold bg-secondary text-white px-2 py-0.5 rounded-full">
                          DEFAULT
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{addr.street_address}</p>
                    <p className="text-xs text-gray-600">{addr.city}, {addr.state} - {addr.pincode}</p>
                    <p className="text-xs font-bold text-gray-700 mt-2">Mobile: {addr.mobile}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100 text-xs">
                    {!addr.is_default ? (
                      <button
                        onClick={() => handleSetDefault(addr.id)}
                        className="text-secondary font-bold hover:underline flex items-center gap-1"
                      >
                        <FaCheck size={10} />
                        <span>Set as Default</span>
                      </button>
                    ) : (
                      <span className="text-teal-600 font-bold flex items-center gap-1 text-[11px]">
                        <FaCheck size={10} /> Default Delivery Address
                      </span>
                    )}
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="text-red-500 hover:text-red-700 font-bold flex items-center gap-1 ml-auto"
                    >
                      <FaTrash size={10} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="text-lg font-black text-primary mb-4">Add New Delivery Address</h3>

            {addressError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-xl mb-4">
                {addressError}
              </div>
            )}

            <form onSubmit={handleCreateAddress} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newAddress.full_name}
                  onChange={(e) => setNewAddress({ ...newAddress, full_name: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2.5 outline-none focus:border-secondary"
                  placeholder="e.g. Asif Raza"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Mobile Number (10 digits)</label>
                <input
                  type="tel"
                  required
                  maxLength="10"
                  value={newAddress.mobile}
                  onChange={(e) => setNewAddress({ ...newAddress, mobile: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2.5 outline-none focus:border-secondary"
                  placeholder="e.g. 7485067874"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Street Address / House No.</label>
                <textarea
                  required
                  rows="2"
                  value={newAddress.street_address}
                  onChange={(e) => setNewAddress({ ...newAddress, street_address: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2.5 outline-none focus:border-secondary"
                  placeholder="Street, Landmark, Flat or Shop number..."
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg p-2.5 outline-none focus:border-secondary"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    maxLength="6"
                    value={newAddress.pincode}
                    onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg p-2.5 outline-none focus:border-secondary"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  required
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2.5 outline-none focus:border-secondary"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="modal_is_default"
                  checked={newAddress.is_default}
                  onChange={(e) => setNewAddress({ ...newAddress, is_default: e.target.checked })}
                  className="accent-secondary h-4 w-4"
                />
                <label htmlFor="modal_is_default" className="text-gray-700 font-bold cursor-pointer">
                  Set as default address
                </label>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-secondary text-white font-bold hover:bg-teal-600 transition"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

