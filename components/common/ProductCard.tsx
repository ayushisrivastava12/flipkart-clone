import React from 'react';
import { Product } from '../../types';
import { Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link to={`/product/${product.id}`} className="group bg-white p-4 hover:shadow-lg transition-shadow duration-200 cursor-pointer border border-transparent hover:border-gray-200 rounded-sm flex flex-col h-full relative">
      <div className="absolute top-4 right-4 z-10 text-gray-400 hover:text-red-500 transition-colors">
        <Heart size={20} className="fill-current bg-white rounded-full" />
      </div>
      
      <div className="h-48 w-full flex items-center justify-center mb-4 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.title} 
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <div className="flex-1 flex flex-col">
        <h3 className="font-medium text-gray-800 text-sm mb-1 truncate group-hover:text-blue-600">
          {product.title}
        </h3>
        
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-green-600 text-white text-xs px-1.5 py-0.5 rounded flex items-center gap-1">
            <span className="font-bold">{product.rating}</span>
            <Star size={10} fill="currentColor" />
          </div>
          <span className="text-gray-500 text-xs">({product.reviewCount.toLocaleString()})</span>
        </div>
        
        <div className="mt-auto">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-gray-900">₹{product.price.toLocaleString()}</span>
            <span className="text-gray-500 text-sm line-through">₹{product.originalPrice.toLocaleString()}</span>
            <span className="text-green-600 text-xs font-bold">{product.discount}% off</span>
          </div>
          {product.isAssured && (
            <div className="mt-1">
               <span className="text-xs bg-gray-100 text-blue-600 px-1 border border-gray-200 rounded">Assured</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
