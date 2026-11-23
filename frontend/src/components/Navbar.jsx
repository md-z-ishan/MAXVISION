import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { FaShoppingCart, FaHeart, FaUser, FaPhoneAlt, FaSearch, FaTimes, FaBars } from 'react-icons/fa';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const activeCategory = searchParams.get('category')?.toLowerCase() || '';

  const triggerSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      triggerSearch();
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setShowDropdown(false);
    navigate('/');
  };

  const isNavActive = (path, cat = null) => {
    if (cat) {
      return location.pathname === '/products' && activeCategory === cat;
    }
    return location.pathname === path && !location.search;
  };

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-gray-100 shadow-xs">
      {/* Top Small Nav */}
      <div className="flex justify-between items-center px-4 md:px-12 py-2 text-[13px] font-bold text-gray-700 border-b border-gray-100 hidden md:flex">
        <div className="flex space-x-3 divide-x divide-gray-200">
          <Link to="/" className="hover:text-secondary transition-colors">Engineered by Zissuu</Link>
          <Link to="/stores" className="pl-3 hover:text-secondary transition-colors">Ray-Ban</Link>
          <span className="pl-3 cursor-pointer hover:text-secondary transition-colors">Titan Eye+</span>
          <span className="pl-3 cursor-pointer hover:text-secondary transition-colors">Fastrack</span>
          <span className="pl-3 cursor-pointer hover:text-secondary transition-colors">Vision Plus</span>
          <span className="pl-3 cursor-pointer hover:text-secondary transition-colors">Oakley</span>
          <span className="pl-3 cursor-pointer hover:text-secondary transition-colors">Ranchi Frames</span>
          <span className="pl-3 cursor-pointer hover:text-secondary transition-colors">Asif Collections</span>
          <span className="pl-3 cursor-pointer hover:text-secondary transition-colors">All Varieties Available</span>
        </div>
        <div className="flex items-center font-black text-primary text-sm">
          <FaPhoneAlt className="mr-2 text-secondary text-xs" />
          <a href="tel:7485067874" className="hover:text-secondary transition-colors">7485067874</a>
          <span className="mx-1.5 text-gray-300">|</span>
          <a href="tel:7033353140" className="hover:text-secondary transition-colors">7033353140</a>
        </div>
      </div>

      {/* Main Nav */}
      <div className="flex justify-between items-center px-4 md:px-12 py-3">

        {/* Left: Mobile Menu Trigger & Logo */}
        <div className="flex items-center gap-3 md:gap-6">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            className="lg:hidden p-2 text-primary hover:text-secondary focus:outline-none"
          >
            {mobileMenuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
          </button>

          <Link to="/" className="text-2xl md:text-3xl font-black tracking-tighter text-primary">
            MAXVISION
          </Link>

          {/* Desktop Categories */}
          <nav className="hidden lg:flex items-center space-x-6 text-[14px] font-extrabold">
            <Link
              to="/products?category=eyeglasses"
              className={`transition-all uppercase py-1 border-b-2 ${
                isNavActive('/products', 'eyeglasses')
                  ? 'text-secondary border-secondary font-black'
                  : 'text-primary border-transparent hover:text-secondary'
              }`}
            >
              Eyeglasses
            </Link>
            <Link
              to="/products?category=sunglasses"
              className={`transition-all uppercase py-1 border-b-2 ${
                isNavActive('/products', 'sunglasses')
                  ? 'text-secondary border-secondary font-black'
                  : 'text-primary border-transparent hover:text-secondary'
              }`}
            >
              Sunglasses
            </Link>
            <Link
              to="/products?category=contact_lenses"
              className={`transition-all uppercase py-1 border-b-2 ${
                isNavActive('/products', 'contact_lenses')
                  ? 'text-secondary border-secondary font-black'
                  : 'text-primary border-transparent hover:text-secondary'
              }`}
            >
              Contacts
            </Link>
            <Link
              to="/special-power"
              className={`transition-all uppercase py-1 border-b-2 ${
                isNavActive('/special-power')
                  ? 'text-secondary border-secondary font-black'
                  : 'text-primary border-transparent hover:text-secondary'
              }`}
            >
              Special Power
            </Link>
            <Link
              to="/stores"
              className={`transition-all uppercase py-1 border-b-2 ${
                isNavActive('/stores')
                  ? 'text-secondary border-secondary font-black'
                  : 'text-primary border-transparent hover:text-secondary'
              }`}
            >
              Stores
            </Link>
            <Link
              to="/try-at-home"
              className={`transition-all uppercase py-1 border-b-2 ${
                isNavActive('/try-at-home')
                  ? 'text-secondary border-secondary font-black'
                  : 'text-primary border-transparent hover:text-secondary'
              }`}
            >
              Try @ Home
            </Link>
          </nav>
        </div>

        {/* Right: Search & User Actions */}
        <div className="flex items-center gap-3 md:gap-4">

          {/* Search Bar with button and clear */}
          <div className="relative w-48 sm:w-64 hidden sm:block">
            <input
              type="text"
              placeholder='Search "premium bestsellers"'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full pl-8 pr-7 py-1.5 border border-gray-200 rounded-lg bg-gray-50/70 text-gray-800 text-xs placeholder-gray-400 focus:outline-none focus:border-secondary focus:bg-white transition-all shadow-2xs"
            />
            <button
              onClick={triggerSearch}
              aria-label="Submit search"
              className="absolute left-2.5 top-2 text-gray-400 hover:text-secondary focus:outline-none"
            >
              <FaSearch size={12} />
            </button>
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  navigate('/products');
                }}
                aria-label="Clear search"
                className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <FaTimes size={12} />
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3.5 text-primary">
            {/* Wishlist */}
            <Link
              to={isAuthenticated ? "/wishlist" : "/login"}
              aria-label="Wishlist"
              className="hover:text-secondary transition-colors p-1"
            >
              <FaHeart size={18} />
            </Link>

            {/* Cart */}
            <Link
              to={isAuthenticated ? "/cart" : "/login"}
              aria-label="Cart"
              className="hover:text-secondary transition-colors relative p-1"
            >
              <FaShoppingCart size={18} />
            </Link>

            {/* Profile Dropdown or Login */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  aria-label="User Account"
                  className="flex items-center gap-1 cursor-pointer hover:text-secondary p-1 transition-colors focus:outline-none"
                >
                  <FaUser size={18} />
                </button>
                {/* Dropdown Menu */}
                {showDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)}></div>
                    <div className="absolute right-0 top-full mt-2.5 w-48 bg-white border border-gray-200 shadow-xl rounded-xl z-50 overflow-hidden">
                      <div className="p-3 border-b border-gray-100 text-xs font-bold text-primary bg-gray-50">
                        Hi, {user?.first_name || user?.username || 'Customer'}
                      </div>
                      <button
                        onClick={() => { navigate('/orders'); setShowDropdown(false); }}
                        className="w-full text-left px-4 py-2.5 text-xs font-bold text-primary hover:bg-gray-50 transition-colors border-b border-gray-100"
                      >
                        My Orders
                      </button>
                      <button
                        onClick={() => { navigate('/wishlist'); setShowDropdown(false); }}
                        className="w-full text-left px-4 py-2.5 text-xs font-bold text-primary hover:bg-gray-50 transition-colors border-b border-gray-100"
                      >
                        My Wishlist
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                aria-label="Sign In"
                className="hover:text-secondary transition-colors p-1"
              >
                <FaUser size={18} />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Horizontal Category Strip */}
      <div className="flex lg:hidden overflow-x-auto px-4 py-2.5 bg-gray-50 space-x-4 text-[12px] font-bold text-primary border-t border-gray-100 no-scrollbar">
        <Link
          to="/products?category=eyeglasses"
          className={`whitespace-nowrap uppercase py-0.5 ${activeCategory === 'eyeglasses' ? 'text-secondary font-black' : ''}`}
        >
          Eyeglasses
        </Link>
        <Link
          to="/products?category=sunglasses"
          className={`whitespace-nowrap uppercase py-0.5 ${activeCategory === 'sunglasses' ? 'text-secondary font-black' : ''}`}
        >
          Sunglasses
        </Link>
        <Link
          to="/products?category=contact_lenses"
          className={`whitespace-nowrap uppercase py-0.5 ${activeCategory === 'contact_lenses' ? 'text-secondary font-black' : ''}`}
        >
          Contacts
        </Link>
        <Link to="/stores" className="whitespace-nowrap uppercase py-0.5">
          Stores
        </Link>
        <Link to="/try-on" className="whitespace-nowrap uppercase py-0.5">
          Try-On
        </Link>
      </div>

      {/* Mobile Drawer Menu (When Hamburger is clicked) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-5 py-4 space-y-3 shadow-md animate-fadeIn">
          {/* Mobile Search Input */}
          <div className="relative mb-3">
            <input
              type="text"
              placeholder='Search "sunglasses", "Ray-Ban"...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  triggerSearch();
                  setMobileMenuOpen(false);
                }
              }}
              className="w-full pl-8 pr-8 py-2 border border-gray-200 rounded-lg text-xs"
            />
            <FaSearch className="absolute left-2.5 top-3 text-gray-400 text-xs" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-3 text-gray-400"
              >
                <FaTimes size={12} />
              </button>
            )}
          </div>

          <div className="flex flex-col space-y-2 text-sm font-bold text-primary">
            <Link
              to="/products?category=eyeglasses"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-secondary"
            >
              Eyeglasses
            </Link>
            <Link
              to="/products?category=sunglasses"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-secondary"
            >
              Sunglasses
            </Link>
            <Link
              to="/products?category=contact_lenses"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-secondary"
            >
              Contact Lenses
            </Link>
            <Link
              to="/special-power"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-secondary"
            >
              Special Power Lenses
            </Link>
            <Link
              to="/stores"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-secondary"
            >
              Ranchi Stores
            </Link>
            <Link
              to="/try-at-home"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-secondary"
            >
              Book Try @ Home
            </Link>
            <Link
              to="/try-on"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-secondary"
            >
              Virtual Try-On 3D
            </Link>
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600 font-semibold">
            <span>Customer Support:</span>
            <a href="tel:7485067874" className="text-secondary font-bold">7485067874</a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
