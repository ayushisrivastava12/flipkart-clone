import React from 'react';
import { Product } from '../../types';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 relative flex flex-col h-full"
    >
      <Link to={`/product/${product.id}`} className="block h-full">
        {/* Image Container */}
        <div className="relative h-48 sm:h-56 w-full bg-gray-50 flex items-center justify-center p-4 overflow-hidden">
          <motion.img
            src={product.image}
            alt={product.title}
            className="max-h-full max-w-full object-contain mix-blend-multiply"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              // Use a deterministic seed so the same product always gets the same fallback image
              const seed = product.id ? String(product.id).replace(/\D/g, '').slice(0, 6) || '100' : '100';
              target.src = `https://picsum.photos/seed/${seed}/300/300`;
              target.onerror = null; // prevent infinite loop
            }}
          />

          {/* Wishlist Button */}
          <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur rounded-full shadow-sm text-gray-400 hover:text-red-500 hover:bg-white transition-all transform hover:scale-110">
            <Heart size={18} />
          </button>

          {/* Tags */}
          {product.isAssured && (
            <div className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow-sm">
              Premium
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors h-10">
            {product.title}
          </h3>

          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center bg-green-50 text-green-700 px-1.5 py-0.5 rounded text-xs gap-1 font-bold">
              {product.rating} <Star size={10} fill="currentColor" />
            </div>
            <span className="text-gray-400 text-xs">({product.reviewCount})</span>
          </div>

          <div className="mt-auto">
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-lg font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
              <span className="text-sm text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                {product.discount}% OFF
              </span>
            </div>

            <button className="w-full py-2 rounded-lg border border-blue-600 text-blue-600 font-medium hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2 text-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
              <ShoppingCart size={16} /> Add to Cart
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
