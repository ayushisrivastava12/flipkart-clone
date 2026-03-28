import React, { useEffect, useState } from 'react';
import { categories, products } from '../services/mockData';
import ProductCard from '../components/common/ProductCard';
import { ChevronLeft, ChevronRight, Timer, ArrowRight, TrendingUp, ShieldCheck, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners = [
    {
      id: 1,
      title: "Summer Collection 2024",
      subtitle: "Up to 60% Off on Premium Brands",
      image: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1200",
      color: "from-pink-500 to-rose-500"
    },
    {
      id: 2,
      title: "Next Gen Electronics",
      subtitle: "Experience the Future Today",
      image: "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=1200",
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: 3,
      title: "Exclusive Footwear",
      subtitle: "Step Up Your Game",
      image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1200",
      color: "from-orange-500 to-amber-500"
    },
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
    <div className="bg-gray-50 min-h-screen pb-12">

      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[500px] overflow-hidden mb-8">
        <div className="absolute inset-0 z-0">
          {banners.map((banner, index) => (
            <motion.div
              key={banner.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: index === currentSlide ? 1 : 0 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0 w-full h-full"
            >
              <div className="absolute inset-0 bg-black/40 z-10" />
              <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 z-20 flex items-center justify-center text-center px-4">
                <div className="max-w-3xl">
                  <motion.span
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: index === currentSlide ? 0 : 20, opacity: index === currentSlide ? 1 : 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className={`inline-block px-4 py-1 rounded-full text-white text-sm font-bold mb-4 bg-gradient-to-r ${banner.color}`}
                  >
                    Limited Time Offer
                  </motion.span>
                  <motion.h1
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: index === currentSlide ? 0 : 30, opacity: index === currentSlide ? 1 : 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg"
                  >
                    {banner.title}
                  </motion.h1>
                  <motion.p
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: index === currentSlide ? 0 : 30, opacity: index === currentSlide ? 1 : 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="text-xl text-gray-100 mb-8 font-light"
                  >
                    {banner.subtitle}
                  </motion.p>
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: index === currentSlide ? 0 : 30, opacity: index === currentSlide ? 1 : 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  >
                    <Link to="/products" className="bg-white text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-lg inline-flex items-center gap-2">
                      Shop Now <ArrowRight size={20} />
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Carousel Controls */}
        <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 backdrop-blur text-white p-3 rounded-full transition-all">
          <ChevronLeft size={24} />
        </button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 backdrop-blur text-white p-3 rounded-full transition-all">
          <ChevronRight size={24} />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/50'}`}
            />
          ))}
        </div>
      </div>

      {/* Features Strip */}
      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-30 mb-12">
        <div className="bg-white rounded-xl shadow-xl p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
              <Truck size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Free Shipping</h3>
              <p className="text-sm text-gray-500">On all orders over ₹500</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-full">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Secure Payment</h3>
              <p className="text-sm text-gray-500">100% secure payment</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-full">
              <TrendingUp size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Best Quality</h3>
              <p className="text-sm text-gray-500">Certified products</p>
            </div>
          </div>
        </div>
      </div>


      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
          <span className="w-1 h-8 bg-blue-600 rounded-full block"></span>
          Shop by Category
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((cat, index) => (
            <Link to={`/products?category=${cat.name}`} key={cat.name} className="group">
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all text-center border border-gray-100 h-full flex flex-col items-center justify-center gap-3"
              >
                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors shadow-sm overflow-hidden border-2 border-transparent group-hover:border-blue-100 p-0.5">
                  <img src={cat.img} alt={cat.name} className="w-full h-full object-cover rounded-full" />
                </div>
                <span className="font-medium text-gray-700 group-hover:text-blue-600 transition-colors">{cat.name}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

      {/* Top Deals Section */}
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Top Deals of the Day</h2>
            <div className="flex items-center gap-2 text-red-500 font-medium">
              <Timer size={18} />
              <span>Ends in 10h 25m 15s</span>
            </div>
          </div>
          <Link to="/products" className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1 group">
            View All <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {products.slice(0, 20).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Electronics Section */}
      <div className="bg-gray-900 text-white py-16 mb-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-bold">Best of Electronics</h2>
            <Link to="/products?category=Electronics" className="px-6 py-2 border border-white/30 rounded-full hover:bg-white hover:text-gray-900 transition-all">
              See More
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {products.filter(p => p.category === 'Electronics' || p.category === 'Mobiles').slice(0, 20).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>

      {/* Fashion Section */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Trending Fashion</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {products.filter(p => p.category === 'Fashion').slice(0, 20).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

    </div>
  );
};

export default Home;
