import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { FaShoppingCart, FaHeart, FaUser, FaPhoneAlt } from 'react-icons/fa';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [showDropdown, setShowDropdown] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      navigate(`/products?search=${e.target.value}`);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setShowDropdown(false);
    navigate('/');
  };

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm">
      {/* Top Small Nav */}
      <div className="flex justify-between items-center px-4 md:px-12 py-3 text-[14px] font-bold text-gray-700 border-b border-gray-100 hidden md:flex">
        <div className="flex space-x-3 divide-x divide-gray-200">
          <Link to="/" className="hover:text-primary transition-colors">Engineered by Zissuu</Link>
          <Link to="/stores" className="pl-3 hover:text-primary transition-colors">Ray-Ban</Link>
          <span className="pl-3 cursor-pointer hover:text-primary transition-colors">Titan Eye+</span>
          <span className="pl-3 cursor-pointer hover:text-primary transition-colors">Fastrack</span>
          <span className="pl-3 cursor-pointer hover:text-primary transition-colors">Vision Plus</span>
          <span className="pl-3 cursor-pointer hover:text-primary transition-colors">Oakley </span>
          <span className="pl-3 cursor-pointer hover:text-primary transition-colors">Ranchi Frames</span>
          <span className="pl-3 cursor-pointer hover:text-primary transition-colors">Asif Collections</span>
          <span className="pl-3 cursor-pointer hover:text-primary transition-colors">All Varities Available</span>
        </div>
        <div className="flex items-center font-black text-primary text-base">
          <FaPhoneAlt className="mr-2 text-base" /> 7485067874 , 7033353140
        </div>
      </div>

      {/* Main Nav */}
      <div className="flex justify-between items-center px-4 md:px-12 py-3">

        {/* Left: Logo & Categories */}
        <div className="flex items-center gap-6">
          <Link to="/" className="text-3xl font-black tracking-tighter text-primary">
            MAXVISION
          </Link>

          <nav className="hidden lg:flex items-center space-x-6 text-[15px] font-extrabold text-primary">
            <Link to="/products?category=eyeglasses" className="hover:text-secondary transition-all uppercase">Eyeglasses</Link>
            <Link to="/products?category=sunglasses" className="hover:text-secondary transition-all uppercase">Sunglasses</Link>
            <Link to="/products?category=contact_lenses" className="hover:text-secondary transition-all uppercase">Contacts</Link>
            <Link to="/products?category=special" className="hover:text-secondary transition-all uppercase">Special Power</Link>
            <Link to="/stores" className="hover:text-secondary transition-all uppercase">Stores</Link>
            <Link to="/try-on" className="hover:text-secondary transition-all uppercase">Try @ Home</Link>
          </nav>
        </div>

        {/* Right: Search & Actions */}
        <div className="flex items-center gap-4">

          <div className="relative w-64 hidden md:block">
            <input
              type="text"
              placeholder='Search "premium bestsellers"'
              onKeyDown={handleSearch}
              className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded bg-gray-50/50 text-gray-800 text-xs placeholder-gray-500 focus:outline-none focus:border-primary transition-all"
            />
            <svg className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>

          <div className="flex items-center space-x-4 text-primary">

            {isAuthenticated ? (
              <>
                <Link to="/wishlist" className="hover:text-secondary transition-colors"><FaHeart size={18} /></Link>
                <Link to="/cart" className="hover:text-secondary transition-colors relative"><FaShoppingCart size={18} /></Link>
                <div className="relative">
                  <div
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-1 cursor-pointer hover:text-secondary p-1 transition-colors"
                  >
                    <FaUser size={18} />
                  </div>
                  {/* Dropdown */}
                  {showDropdown && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)}></div>
                      <div className="absolute right-0 top-full mt-3 w-44 bg-white border border-gray-200 shadow-lg rounded-lg z-50 overflow-hidden">
                        <div className="p-3 border-b border-gray-100 text-sm font-bold text-primary bg-gray-50">Hi, {user?.username || 'User'}</div>
                        <button
                          onClick={() => { navigate('/orders'); setShowDropdown(false); }}
                          className="w-full text-left px-4 py-2 text-sm font-bold text-primary hover:bg-gray-50 transition-colors border-b border-gray-100"
                        >
                          My Orders
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm font-bold text-red-600 hover:bg-gray-50 transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/wishlist" className="hover:text-secondary transition-colors"><FaHeart size={18} /></Link>
                <Link to="/cart" className="hover:text-secondary transition-colors relative"><FaShoppingCart size={18} /></Link>
                <Link to="/login" className="hover:text-secondary transition-colors"><FaUser size={18} /></Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Nav Links */}
      <div className="flex lg:hidden overflow-x-auto px-4 py-2 bg-gray-50 space-x-4 text-[11px] font-bold text-primary border-t border-gray-100">
        <Link to="/products?category=eyeglasses" className="whitespace-nowrap uppercase">Eyeglasses</Link>
        <Link to="/products?category=sunglasses" className="whitespace-nowrap uppercase">Sunglasses</Link>
        <Link to="/products?category=contact_lenses" className="whitespace-nowrap uppercase">Contacts</Link>
        <Link to="/stores" className="whitespace-nowrap uppercase">Stores</Link>
      </div>
    </header>
  );
};

export default Navbar;
