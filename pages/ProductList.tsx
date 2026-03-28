import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products, categories } from '../services/mockData';
import ProductCard from '../components/common/ProductCard';
import { Filter, Check } from 'lucide-react';

const ProductList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('relevance');

  const [liveProducts, setLiveProducts] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiSource, setApiSource] = useState<'flipkart' | 'dummyjson' | 'local' | null>(null);

  useEffect(() => {
    if (!searchParam) {
      setLiveProducts(null);
      setApiSource(null);
      return;
    }

    setIsLoading(true);
    setLiveProducts(null);
    setApiSource(null);

    // Helper: map a DummyJSON product to our format (USD → INR)
    const mapDummy = (p: any) => {
      const price = Math.round((p.price || 999) * 85);
      const discount = p.discountPercentage ? Math.round(p.discountPercentage) : Math.floor(Math.random() * 25) + 5;
      return {
        id: 'd_' + p.id,
        title: p.title,
        brand: p.brand || p.category || 'Generic',
        price,
        originalPrice: Math.round(price / (1 - discount / 100)),
        discount,
        rating: p.rating || parseFloat((4.0 + Math.random() * 0.9).toFixed(1)),
        reviewCount: p.stock ? p.stock * 10 : Math.floor(Math.random() * 2000) + 50,
        reviews: p.stock ? p.stock * 10 : Math.floor(Math.random() * 2000) + 50,
        image: p.thumbnail || (p.images && p.images[0]) || '',
        images: p.images || [p.thumbnail],
        category: p.category || 'Search Result',
        description: p.description || '',
        isNew: true,
        isAssured: Math.random() > 0.5,
      };
    };

    // Helper: map a backend (Flipkart scraper) product to our format
    const mapBackend = (p: any) => {
      const price = typeof p.price === 'string'
        ? parseInt(p.price.replace(/[^0-9]/g, ''), 10) || 999
        : p.price || 999;
      const discount = Math.floor(Math.random() * 25) + 5;
      return {
        id: 'b_' + (p.id || Math.random().toString(36).slice(2)),
        title: p.title || 'Product',
        brand: p.brand || 'LiveSearch',
        price,
        originalPrice: Math.round(price / (1 - discount / 100)),
        discount,
        rating: parseFloat((4.0 + Math.random() * 0.9).toFixed(1)),
        reviewCount: Math.floor(Math.random() * 2000) + 50,
        reviews: Math.floor(Math.random() * 2000) + 50,
        image: p.image || '',
        images: [p.image || ''],
        category: 'Search Result',
        description: p.description || '',
        isNew: true,
        isAssured: Math.random() > 0.5,
      };
    };

    const saveToStorage = (mapped: any[]) => {
      const existing = JSON.parse(localStorage.getItem('liveProducts') || '{}');
      mapped.forEach((p: any) => { existing[p.id] = p; });
      localStorage.setItem('liveProducts', JSON.stringify(existing));
    };

    const useLocalFallback = () => {
      setLiveProducts(null);
      setApiSource('local');
      setIsLoading(false);
    };

    // ── LAYER 2: DummyJSON ──────────────────────────────────────────────────
    const tryDummyJSON = () => {
      // Use first keyword for better match in DummyJSON's limited catalog
      const keyword = searchParam.trim().split(/\s+/)[0];
      fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(keyword)}&limit=100`)
        .then(r => { if (!r.ok) throw new Error('DummyJSON error'); return r.json(); })
        .then(data => {
          const raw = data.products || [];
          if (raw.length > 0) {
            const mapped = raw.map(mapDummy);
            setLiveProducts(mapped);
            setApiSource('dummyjson');
            saveToStorage(mapped);
            setIsLoading(false);
          } else {
            useLocalFallback();
          }
        })
        .catch(() => useLocalFallback());
    };

    // ── LAYER 1: Backend (Flipkart scraper at localhost:5000) ───────────────
    fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(searchParam)}`)
      .then(r => { if (!r.ok) throw new Error('Backend error'); return r.json(); })
      .then(data => {
        const raw = Array.isArray(data) ? data : [];
        if (raw.length > 0) {
          const mapped = raw.map(mapBackend);
          setLiveProducts(mapped);
          setApiSource('flipkart');
          saveToStorage(mapped);
          setIsLoading(false);
        } else {
          // Backend returned nothing → try DummyJSON
          tryDummyJSON();
        }
      })
      .catch(() => {
        // Backend unreachable → try DummyJSON
        tryDummyJSON();
      });

  }, [searchParam]);

  // ── Filter & Sort Logic ──────────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    let result = liveProducts !== null ? liveProducts : products;

    // Category filter (only for mock data)
    if (categoryParam && liveProducts === null) {
      result = result.filter(p => p.category === categoryParam);
    }

    // Local search: match ANY word from the query (fuzzy word-by-word)
    if (searchParam && liveProducts === null) {
      const words = searchParam.toLowerCase().trim().split(/\s+/).filter(w => w.length > 2);
      if (words.length > 0) {
        result = result.filter(p => {
          const haystack = `${p.title} ${p.category} ${p.brand}`.toLowerCase();
          return words.some(word => haystack.includes(word));
        });
      }
    }

    // Price & rating filter
    result = result.filter(p => {
      const price = p.price || 0;
      const rating = p.rating || 0;
      return price >= priceRange[0] && price <= priceRange[1] && rating >= minRating;
    });

    if (sortBy === 'lowToHigh') result = [...result].sort((a, b) => a.price - b.price);
    else if (sortBy === 'highToLow') result = [...result].sort((a, b) => b.price - a.price);

    return result;
  }, [categoryParam, searchParam, priceRange, minRating, sortBy, liveProducts]);

  const sourceLabel = () => {
    if (isLoading) return <span className="text-blue-600 font-bold ml-2 animate-pulse">🔍 Searching internet...</span>;
    if (apiSource === 'flipkart') return <span className="text-blue-600 text-xs font-semibold ml-2 bg-blue-50 px-2 py-0.5 rounded-full">🛒 Flipkart Live — {filteredProducts.length} products</span>;
    if (apiSource === 'dummyjson') return <span className="text-green-600 text-xs font-semibold ml-2 bg-green-50 px-2 py-0.5 rounded-full">🌐 Live — {filteredProducts.length} products</span>;
    if (apiSource === 'local') return <span className="text-orange-500 text-xs font-semibold ml-2 bg-orange-50 px-2 py-0.5 rounded-full">📦 Local — {filteredProducts.length} items</span>;
    return <span className="text-gray-500 text-sm font-normal ml-2">({filteredProducts.length} items)</span>;
  };

  return (
    <div className="bg-gray-100 min-h-screen py-4">
      <div className="max-w-[1400px] mx-auto px-2 md:px-4 flex gap-4">

        {/* Sidebar Filters */}
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
              max="200000"
              step="1000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm mt-2">
              <span>₹0</span>
              <span>₹{priceRange[1].toLocaleString()}</span>
            </div>
          </div>

          {/* Categories (only when not in live search) */}
          {liveProducts === null && (
            <div className="mb-6">
              <h3 className="font-medium mb-2 text-xs uppercase text-gray-600">Categories</h3>
              <ul className="text-sm space-y-2 text-gray-700">
                {categories.map(c => (
                  <li key={c.name} className="flex items-center gap-2">
                    <div className={`w-3 h-3 border rounded-sm flex items-center justify-center ${categoryParam === c.name ? 'bg-blue-600 border-blue-600' : 'border-gray-400'}`}>
                      {categoryParam === c.name && <Check size={10} className="text-white" />}
                    </div>
                    {c.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {liveProducts !== null && (
            <div className="mb-6 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700 font-medium">🌐 Live Results</p>
              <p className="text-xs text-blue-500 mt-1">Use Price & Rating filters to narrow results.</p>
            </div>
          )}

          {/* Customer Ratings */}
          <div className="mb-6">
            <h3 className="font-medium mb-2 text-xs uppercase text-gray-600">Customer Ratings</h3>
            {[4, 3, 2].map((rating) => (
              <div key={rating} className="flex items-center gap-2 mb-2 cursor-pointer" onClick={() => setMinRating(minRating === rating ? 0 : rating)}>
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
              {categoryParam ? categoryParam : searchParam ? `Search Results for "${searchParam}"` : 'All Products'}
              {sourceLabel()}
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
          ) : !isLoading ? (
            <div className="bg-white p-12 text-center shadow-sm">
              <img src="https://picsum.photos/seed/empty/200/200" alt="No results" className="mx-auto mb-4 grayscale opacity-50" />
              <h3 className="text-xl font-medium text-gray-900">No products found</h3>
              <p className="text-gray-500 mt-2">Try a shorter keyword, like just "top" or "girls top".</p>
            </div>
          ) : null}
        </div>

      </div>
    </div>
  );
};

export default ProductList;