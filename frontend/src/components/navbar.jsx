import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/Cartcontext.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import axiosInstance from "../api/axiosInstance";
import { getImageUrl } from "../utils/imageUrl";

function Navbar() {
  const { cart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logoutUser } = useContext(AuthContext);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    axiosInstance.get('/categories/')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const fetchSuggestions = async () => {
        try {
          const res = await axiosInstance.get(`/products/?search=${encodeURIComponent(searchQuery)}`);
          const items = Array.isArray(res.data) ? res.data : (res.data?.results || []);
          setSuggestions(items.slice(0, 5));
        } catch (error) {
          console.error("Error fetching suggestions", error);
        }
      };
      const debounceTimer = setTimeout(fetchSuggestions, 300);
      return () => clearTimeout(debounceTimer);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      setShowSuggestions(false);
      navigate(`/?search=${searchQuery}`);
    }
  };
  const cartcount = Array.isArray(cart) ? cart.reduce((total, item) => total + (item.quantity || 0), 0) : 0;
  
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo Section */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-xl flex items-center justify-center shadow-xl shadow-gray-900/20 transform group-hover:scale-105 transition-all duration-300 border border-gray-700/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-pink-500 font-black text-xl tracking-wider relative z-10">
                  IS
                </span>
              </div>
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight">
                IndeStack
              </span>
            </Link>

            {/* Search Bar */}
            <div className="relative hidden lg:block z-50">
              <div className="flex items-center bg-gray-50/80 border border-gray-200 rounded-full px-4 py-2 hover:bg-white hover:shadow-md hover:border-gray-300 transition-all duration-300 focus-within:bg-white focus-within:shadow-md focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 w-80">
                <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search premium products..."
                  className="bg-transparent outline-none w-full text-sm text-gray-700 placeholder-gray-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  onKeyDown={handleSearchSubmit}
                />
              </div>
              
              {/* Search Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden">
                  {suggestions.map((item) => (
                    <Link
                      key={item.id}
                      to={`/product/${item.id}`}
                      className="flex items-center px-4 py-3 hover:bg-orange-50 transition-colors"
                      onClick={() => setSearchQuery("")}
                    >
                      <img src={getImageUrl(item.image)} alt={item.name} className="w-10 h-10 object-cover rounded-md" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-500">${item.price}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Navigation & Cart */}
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex space-x-8 mr-4 items-center">
              <Link onClick={() => { setSearchQuery(""); }} to="/" className={`text-sm font-semibold transition-colors duration-200 ${location.pathname === '/' && !location.search ? 'text-orange-500' : 'text-gray-600 hover:text-orange-500'}`}>Home</Link>
              <Link onClick={() => { setSearchQuery(""); }} to="/" className="text-sm font-semibold text-gray-600 hover:text-orange-500 transition-colors duration-200">Shop</Link>
              <div className="relative group" onMouseEnter={() => setIsCategoryOpen(true)} onMouseLeave={() => setIsCategoryOpen(false)}>
                <button className="text-sm font-semibold text-gray-600 hover:text-orange-500 transition-colors duration-200 flex items-center">
                  Categories
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                {isCategoryOpen && categories.length > 0 && (
                  <div className="absolute top-full left-0 pt-2 w-48 z-50">
                    <div className="bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden">
                      {categories.map(cat => (
                        <Link key={cat.id} to={`/?category=${cat.name}`} onClick={() => setIsCategoryOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500">
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4 pl-4 border-l border-gray-200">
              {user ? (
                <div className="flex items-center space-x-4 hidden sm:flex">
                  <span className="text-sm font-medium text-gray-700">Hi, {user.username || 'User'}</span>
                  <button onClick={logoutUser} className="text-sm font-semibold text-gray-600 hover:text-red-500 transition-colors duration-200">
                    Logout
                  </button>
                </div>
              ) : (
                <Link to="/login" className="text-gray-600 hover:text-orange-500 transition-colors hidden sm:block">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>
              )}

              <Link to="/cart" className="relative group">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-50 rounded-full hover:bg-orange-50 transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 group-hover:text-orange-500 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                {cartcount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold shadow-md transform scale-100 group-hover:scale-110 transition-transform duration-200">
                    {cartcount}
                  </span>
                )}
              </Link>
              
              {/* Mobile menu button */}
              <button 
                className="md:hidden ml-2 p-2 rounded-md text-gray-600 hover:text-orange-500 hover:bg-gray-100 focus:outline-none"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
          
        </div>
        
        {/* Mobile Search Bar - Always Visible on small screens */}
        <div className="md:hidden pb-4 pt-2">
          <div className="flex items-center bg-gray-50/80 border border-gray-200 rounded-full px-4 py-2 focus-within:bg-white focus-within:shadow-md focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 w-full">
            <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search premium products..."
              className="bg-transparent outline-none w-full text-sm text-gray-700 placeholder-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchSubmit}
            />
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-4 pb-4 space-y-1 shadow-lg absolute w-full left-0 z-50">
          <Link onClick={() => { setSearchQuery(""); setIsMobileMenuOpen(false); }} to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-orange-50">Home</Link>
          <Link onClick={() => { setSearchQuery(""); setIsMobileMenuOpen(false); }} to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-orange-50">Shop</Link>
          
          <div className="pt-2 pb-2">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Categories</p>
            <div className="mt-1 space-y-1 pl-3">
              {categories.map(cat => (
                <Link key={cat.id} to={`/?category=${cat.name}`} onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-orange-500 hover:bg-orange-50">
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
          
          {user ? (
            <div className="pt-4 pb-2 border-t border-gray-100">
              <div className="flex items-center px-3 mb-3">
                <div className="text-base font-medium text-gray-800">Hi, {user.username || 'User'}</div>
              </div>
              <button onClick={() => { logoutUser(); setIsMobileMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50">
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-gray-100">
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-orange-50">
                Login / Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;