import React, { useEffect, useState } from 'react';
import { categories, products } from '../services/mockData';
import ProductCard from '../components/common/ProductCard';
import { ChevronLeft, ChevronRight, Timer } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners = [
    'https://picsum.photos/seed/banner1/1200/300',
    'https://picsum.photos/seed/banner2/1200/300',
    'https://picsum.photos/seed/banner3/1200/300',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % banners.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);

  return (
    <div className="bg-gray-100 min-h-screen pb-8">
      {/* Categories Header */}
      <div className="bg-white shadow-sm py-3 mb-2 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 flex justify-between min-w-max gap-8 md:gap-12">
          {categories.map((cat) => (
            <Link to={`/products?category=${cat.name}`} key={cat.name} className="flex flex-col items-center group cursor-pointer hover:text-blue-600 transition-colors">
              <div className="w-16 h-16 mb-1 overflow-hidden">
                <img src={cat.img} alt={cat.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-sm font-medium text-gray-800 group-hover:text-blue-600">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Hero Carousel */}
      <div className="relative bg-white mb-4 group h-[150px] md:h-[280px] overflow-hidden">
        <div 
            className="flex transition-transform duration-500 ease-out h-full" 
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
            {banners.map((src, index) => (
                <img key={index} src={src} className="w-full h-full object-cover flex-shrink-0" alt="Banner" />
            ))}
        </div>
        <button onClick={prevSlide} className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/50 p-2 md:p-3 rounded-r hover:bg-white shadow-md transition-all opacity-0 group-hover:opacity-100">
            <ChevronLeft size={24} />
        </button>
        <button onClick={nextSlide} className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/50 p-2 md:p-3 rounded-l hover:bg-white shadow-md transition-all opacity-0 group-hover:opacity-100">
            <ChevronRight size={24} />
        </button>
      </div>

      {/* Top Deals Section */}
      <div className="max-w-7xl mx-auto px-2 md:px-4 mb-4">
        <div className="bg-white p-4 shadow-sm">
          <div className="flex justify-between items-end mb-4 border-b pb-3">
             <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                <h2 className="text-xl font-medium text-black">Top Deals</h2>
                <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs">
                    <Timer size={14} />
                    <span>22h 15m Remaining</span>
                </div>
             </div>
             <Link to="/products" className="bg-blue-600 text-white px-4 py-2 text-sm font-medium rounded-sm shadow-sm hover:bg-blue-700 transition">View All</Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.slice(0, 5).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>

       {/* Featured Section 2 */}
       <div className="max-w-7xl mx-auto px-2 md:px-4 mb-4">
        <div className="bg-white p-4 shadow-sm">
           <h2 className="text-xl font-medium text-black mb-4">Best of Electronics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {products.filter(p => p.category === 'Electronics' || p.category === 'Mobiles').slice(0, 5).map((product) => (
                <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
      </div>
      
       {/* Featured Section 3 */}
       <div className="max-w-7xl mx-auto px-2 md:px-4">
        <div className="bg-white p-4 shadow-sm">
           <h2 className="text-xl font-medium text-black mb-4">Trending Fashion</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {products.filter(p => p.category === 'Fashion').slice(0, 5).map((product) => (
                <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
      </div>

    </div>
  );
};

export default Home;
