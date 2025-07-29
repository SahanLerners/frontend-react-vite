import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {Menu, X, ShoppingCart, User, Search, LogOut, Package, Settings, Phone, Home} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { logoutUser } from '../../store/slices/authSlice';
import { fetchCart } from '../../store/slices/cartSlice';
import { useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated, isAdmin } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [isAuthenticated, dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const cartItemsCount = cart?.totalItems || 0;

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Techno Computers</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </form>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                {isAdmin ? (
                        <><Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors flex items-center space-x-1" onClick={() => setIsMenuOpen(false)}>
                          <Home className="w-4 h-4" />
                          <span>Home</span>
                        </Link>
                          <Link
                              to="/admin"
                              className={`text-gray-700 hover:text-blue-600 transition-colors flex items-center space-x-1 ${
                                  location.pathname.startsWith('/admin') ? 'text-blue-600 font-medium' : ''
                              }`}
                          >
                            <Settings className="w-4 h-4" />
                            <span>Admin</span>
                          </Link>
                        </>
                ) : (
                  <>
                    <Link to="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                      Home
                    </Link>
                    <Link
                        to="/products"
                        className={`text-gray-700 hover:text-blue-600 transition-colors ${
                            location.pathname === '/products' ? 'text-blue-600 font-medium' : ''
                        }`}
                    >
                      Products
                    </Link>
                    <Link
                      to="/cart"
                      className={`relative text-gray-700 hover:text-blue-600 transition-colors ${
                        location.pathname === '/cart' ? 'text-blue-600 font-medium' : ''
                      }`}
                    >
                      <ShoppingCart className="w-6 h-6" />
                      {cartItemsCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {cartItemsCount}
                        </span>
                      )}
                    </Link>
                    <Link
                      to="/orders"
                      className={`text-gray-700 hover:text-blue-600 transition-colors ${
                        location.pathname === '/orders' ? 'text-blue-600 font-medium' : ''
                      }`}
                    >
                      Orders
                    </Link>
                  </>
                )}
                
                <div className="relative group">
                  <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
                    <User className="w-5 h-5" />
                    <span className="hidden lg:block">{user?.firstName}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                      <Link
                          to="/contact"
                          className={`flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                              location.pathname === '/contact' ? 'text-blue-600 font-medium' : ''
                          }`}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Contact
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                  Home
                </Link>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Register
                </Link>
                <Link
                    to="/contact"
                    className={`text-gray-700 hover:text-blue-600 transition-colors ${
                        location.pathname === '/contact' ? 'text-blue-600 font-medium' : ''
                    }`}
                >
                  Contact
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </form>

            <nav className="space-y-2">
              {isAuthenticated ? (
                <>
                  {isAdmin ? (
                    <>
                      <Link to="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                        Home
                      </Link>
                      <Link
                          to="/admin"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                          onClick={() => setIsMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                        Home
                      </Link>
                      <Link
                        to="/cart"
                        className="flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span>Cart</span>
                        {cartItemsCount > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {cartItemsCount}
                          </span>
                        )}
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Orders
                      </Link>
                    </>
                  )}
                  
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                      to="/contact"
                      className={`flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                          location.pathname === '/contact' ? 'text-blue-600 font-medium' : ''
                      }`}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Contact
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                    Home
                  </Link>
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                  <Link
                      to="/contact"
                      className={`text-gray-700 hover:text-blue-600 transition-colors ${
                          location.pathname === '/contact' ? 'text-blue-600 font-medium' : ''
                      }`}
                  >
                    Contact
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;