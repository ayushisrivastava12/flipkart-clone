import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products, categories } from '../services/mockData';
import ProductCard from '../components/common/ProductCard';
import { Filter, ChevronDown, Check } from 'lucide-react';

const ProductList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('relevance'); // relevance, lowToHigh, highToLow

  // Filter Logic
  const filteredProducts = useMemo(() => {
    let result = products;

    if (categoryParam) {
      result = result.filter(p => p.category === categoryParam);
    }

    if (searchParam) {
      const lowerSearch = searchParam.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(lowerSearch) || 
        p.category.toLowerCase().includes(lowerSearch) ||
        p.brand.toLowerCase().includes(lowerSearch)
      );
    }

    result = result.filter(p => 
      p.price >= priceRange[0] && 
      p.price <= priceRange[1] &&
      p.rating >= minRating
    );

    if (sortBy === 'lowToHigh') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'highToLow') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [categoryParam, searchParam, priceRange, minRating, sortBy]);

  return (
    <div className="bg-gray-100 min-h-screen py-4">
      <div className="max-w-[1400px] mx-auto px-2 md:px-4 flex gap-4">
        
        {/* Sidebar Filters - Hidden on mobile for simplicity in this demo */}
        <div className="hidden md:block w-64 bg-white p-4 shadow-sm h-fit sticky top-20">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="text-lg font-bold">Filters</h2>
            <Filter size={16} />
          </div>

          {/* Price Filter */}
          <div className="mb-6">
            <h3 className="font-medium mb-2 text-xs uppercase text-gray-600">Price</h3>
            <input 
              type="range" 
              min="0" 
              max="50000" 
              step="1000"
              value={priceRange[1]} 
              onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm mt-2">
              <span>₹0</span>
              <span>₹{priceRange[1]}</span>
            </div>
          </div>

          {/* Categories */}
          <div className="mb-6">
             <h3 className="font-medium mb-2 text-xs uppercase text-gray-600">Categories</h3>
             <ul className="text-sm space-y-2 text-gray-700">
                {categories.map(c => (
                    <li key={c.name} className="flex items-center gap-2">
                         <div className={`w-3 h-3 border rounded-sm flex items-center justify-center ${categoryParam === c.name ? 'bg-blue-600 border-blue-600' : 'border-gray-400'}`}>
                           {categoryParam === c.name && <Check size={10} className="text-white"/>}
                         </div>
                         {c.name}
                    </li>
                ))}
             </ul>
          </div>

          {/* Ratings */}
          <div className="mb-6">
            <h3 className="font-medium mb-2 text-xs uppercase text-gray-600">Customer Ratings</h3>
            {[4, 3, 2].map((rating) => (
              <div key={rating} className="flex items-center gap-2 mb-2 cursor-pointer" onClick={() => setMinRating(rating)}>
                <input 
                  type="checkbox" 
                  checked={minRating === rating} 
                  onChange={() => setMinRating(minRating === rating ? 0 : rating)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">{rating}★ & above</span>
              </div>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="bg-white p-3 mb-4 shadow-sm flex flex-col sm:flex-row justify-between items-center">
             <span className="font-medium text-gray-900 mb-2 sm:mb-0">
               {categoryParam ? categoryParam : 'All Products'} 
               <span className="text-gray-500 text-sm font-normal ml-2">(Showing {filteredProducts.length} items)</span>
             </span>
             <div className="flex items-center gap-4 text-sm">
                <span className="font-medium">Sort By</span>
                <button 
                  className={`pb-0.5 border-b-2 ${sortBy === 'relevance' ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent text-gray-800'}`}
                  onClick={() => setSortBy('relevance')}
                >
                  Relevance
                </button>
                <button 
                  className={`pb-0.5 border-b-2 ${sortBy === 'lowToHigh' ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent text-gray-800'}`}
                  onClick={() => setSortBy('lowToHigh')}
                >
                  Price -- Low to High
                </button>
                <button 
                  className={`pb-0.5 border-b-2 ${sortBy === 'highToLow' ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent text-gray-800'}`}
                  onClick={() => setSortBy('highToLow')}
                >
                  Price -- High to Low
                </button>
             </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 text-center shadow-sm">
              <img src="https://picsum.photos/seed/empty/200/200" alt="No results" className="mx-auto mb-4 grayscale opacity-50" />
              <h3 className="text-xl font-medium text-gray-900">No products found</h3>
              <p className="text-gray-500 mt-2">Try checking your spelling or use different filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;