import React, { useState } from 'react';
import { Search, ShoppingCart, User, Menu, X, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { logout } from '../../redux/authSlice';

const Navbar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { items } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-blue-600 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        
        {/* Logo */}
        <Link to="/" className="flex flex-col items-start leading-none group mr-4">
          <span className="font-bold italic text-xl tracking-wide">AyushiMart</span>
          <span className="text-[10px] italic flex items-center gap-0.5 text-gray-200">
            Explore <span className="text-yellow-400 font-bold">Plus</span>
          </span>
        </Link>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-2xl relative">
          <form onSubmit={handleSearch} className="w-full relative">
            <input
              type="text"
              placeholder="Search for products, brands and more"
              className="w-full py-2 px-4 pr-12 text-gray-900 bg-white border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-sm placeholder-gray-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="absolute right-0 top-0 h-full px-3 text-blue-600">
              <Search size={20} />
            </button>
          </form>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-6 font-medium">
          {isAuthenticated ? (
            <div className="group relative cursor-pointer">
              <div className="flex items-center gap-1">
                <span className="truncate max-w-[100px]">{user?.name}</span>
              </div>
              {/* Dropdown */}
              <div className="absolute right-0 top-full pt-2 w-48 hidden group-hover:block">
                 <div className="bg-white text-gray-800 shadow-lg rounded border border-gray-100 py-1">
                    <Link to="/orders" className="block px-4 py-2 hover:bg-gray-50">My Orders</Link>
                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-50">My Profile</Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2">
                       <LogOut size={14}/> Logout
                    </button>
                 </div>
              </div>
            </div>
          ) : (
            <Link to="/login" className="bg-white text-blue-600 px-8 py-1 font-semibold rounded-sm hover:bg-gray-50 transition-colors">
              Login
            </Link>
          )}

          <Link to="/products" className="hover:text-gray-100">More</Link>

          <Link to="/cart" className="flex items-center gap-2 hover:text-gray-100">
            <div className="relative">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </div>
            <span>Cart</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4 ml-auto">
             <Link to="/cart" className="flex items-center gap-1 relative">
                <ShoppingCart size={24} />
                 {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
             </Link>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white text-gray-800 absolute w-full left-0 top-16 shadow-lg z-40 border-t">
          <div className="p-4 flex flex-col gap-4">
             <form onSubmit={handleSearch} className="relative">
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full border border-gray-300 p-2 rounded bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="absolute right-2 top-2 text-gray-500"><Search size={20}/></button>
            </form>
            
            {isAuthenticated ? (
                <>
                    <div className="flex items-center gap-2 font-bold p-2 bg-gray-50 rounded">
                        <User size={20} />
                        {user?.name}
                    </div>
                    <Link to="/orders" className="p-2 border-b" onClick={() => setIsMobileMenuOpen(false)}>My Orders</Link>
                    <button onClick={handleLogout} className="p-2 text-left text-red-600 border-b">Logout</button>
                </>
            ) : (
                <Link to="/login" className="bg-blue-600 text-white p-2 text-center rounded" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
            )}
            
            <Link to="/products" className="p-2 border-b" onClick={() => setIsMobileMenuOpen(false)}>All Categories</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;