import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, Menu, X, LogOut, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { products as allProducts } from '../../services/mockData';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { logout } from '../../redux/authSlice';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { items } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
      setIsMobileMenuOpen(false);
      setSearchTerm('');
      setSuggestions([]);
    }
  };

  useEffect(() => {
    const q = searchTerm.trim().toLowerCase();
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    const matched = allProducts.filter((p) =>
      p.title.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    ).slice(0, 6);
    setSuggestions(matched);
  }, [searchTerm]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
        ? 'bg-white/80 backdrop-blur-md shadow-md py-2'
        : 'bg-white py-4 shadow-sm'
      }`}>
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-blue-600 text-white p-1.5 rounded-lg transform group-hover:rotate-12 transition-transform">
            <ShoppingBagIcon />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-bold text-xl text-blue-600 tracking-tight">Apna Store</span>
          </div>
        </Link>

        {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <form onSubmit={handleSearch} className="w-full relative group">
            <input
              type="text"
              placeholder="Search for products, brands and more"
              className="w-full py-2.5 px-5 pl-12 text-gray-700 bg-gray-100 border-none rounded-full focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all shadow-sm group-hover:shadow-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="absolute left-4 top-1/2 -translate-y-1/2 hover:scale-110 transition-transform">
              <Search className="text-gray-400 group-hover:text-blue-500 transition-colors" size={20} />
            </button>

            {suggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50">
                {suggestions.map((s) => (
                  <button key={s.id} onClick={() => { navigate(`/product/${s.id}`); setSearchTerm(''); setSuggestions([]); }} className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50">
                    <img src={s.image} alt={s.title} className="w-10 h-10 object-cover rounded-md" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 truncate">{s.title}</div>
                      <div className="text-xs text-gray-500">{s.brand} • {s.category}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </form>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-6">
          {isAuthenticated ? (
            <div className="group relative">
              <button className="flex items-center gap-2 font-medium text-gray-700 hover:text-blue-600 transition-colors py-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[100px] truncate">{user?.name}</span>
              </button>

              {/* Dropdown */}
              <div className="absolute right-0 top-full pt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right scale-95 group-hover:scale-100">
                <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                  <div className="p-4 border-b border-gray-50 bg-gray-50">
                    <p className="text-xs text-gray-500 font-medium">Signed in as</p>
                    <p className="text-sm font-bold text-gray-900 truncate">{user?.email}</p>
                  </div>
                  <Link to="/orders" className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">My Orders</Link>
                  <Link to="/profile" className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">My Profile</Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 border-t border-gray-50">
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link to="/login" className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2">
              <User size={18} /> Login
            </Link>
          )}

          <Link to="/products" className="text-gray-700 font-medium hover:text-blue-600 transition-colors">
            Explore
          </Link>

          <Link to="/cart" className="relative group p-2">
            <ShoppingCart className="text-gray-700 group-hover:text-blue-600 transition-colors" size={24} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white transform group-hover:scale-110 transition-transform">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Actions */}
        <div className="md:hidden flex items-center gap-4">
          <Link to="/cart" className="relative">
            <ShoppingCart size={24} className="text-gray-700" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-700">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="p-4 flex flex-col gap-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full py-2 pl-10 pr-4 bg-gray-50 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 hover:scale-110 transition-transform">
                  <Search className="text-gray-400" size={18} />
                </button>
                {suggestions.length > 0 && (
                  <div className="mt-2 bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
                    {suggestions.map((s) => (
                      <button key={s.id} onClick={() => { navigate(`/product/${s.id}`); setIsMobileMenuOpen(false); setSearchTerm(''); setSuggestions([]); }} className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50">
                        <img src={s.image} alt={s.title} className="w-10 h-10 object-cover rounded-md" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900 truncate">{s.title}</div>
                          <div className="text-xs text-gray-500">{s.brand}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </form>

              {isAuthenticated ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                  <Link to="/orders" className="flex items-center gap-3 p-2 text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>
                    <ShoppingBagIcon size={20} /> My Orders
                  </Link>
                  <Link to="/profile" className="flex items-center gap-3 p-2 text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>
                    <User size={20} /> My Profile
                  </Link>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 p-2 text-red-600 hover:bg-red-50 rounded-lg">
                    <LogOut size={20} /> Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Link to="/login" className="py-2.5 text-center rounded-lg bg-blue-600 text-white font-medium shadow-sm" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                  <Link to="/login" className="py-2.5 text-center rounded-lg border border-blue-600 text-blue-600 font-medium bg-blue-50" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
                </div>
              )}

              <div className="h-px bg-gray-100 my-2"></div>
              <Link to="/products" className="font-medium text-gray-700" onClick={() => setIsMobileMenuOpen(false)}>All Categories</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const ShoppingBagIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <path d="M16 10a4 4 0 0 1-8 0"></path>
  </svg>
);

export default Navbar;
