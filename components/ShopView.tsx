import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import type { AppContextType } from '../context/AppContext';
import ProductCard from './ProductCard';

const ShopView: React.FC = () => {
  const { products, isTranslating } = useContext(AppContext) as AppContextType;
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<{ min: string, max: string }>({ min: '', max: '' });
  const [showInStockOnly, setShowInStockOnly] = useState(false);

  const categories = useMemo(() => ['All', ...new Set(products.map(p => p.category))], [products]);
  
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Allow only numbers and one decimal point
    if (/^\d*\.?\d*$/.test(value)) {
        setPriceRange(prev => ({ ...prev, [name]: value }));
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const minPrice = parseFloat(priceRange.min);
      const maxPrice = parseFloat(priceRange.max);

      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesStock = !showInStockOnly || product.inStock;
      const matchesMinPrice = isNaN(minPrice) || product.price >= minPrice;
      const matchesMaxPrice = isNaN(maxPrice) || product.price <= maxPrice;

      return matchesSearch && matchesCategory && matchesStock && matchesMinPrice && matchesMaxPrice;
    });
  }, [products, searchTerm, selectedCategory, priceRange, showInStockOnly]);
  
  const resetFilters = () => {
      setSearchTerm('');
      setSelectedCategory('All');
      setPriceRange({ min: '', max: '' });
      setShowInStockOnly(false);
  };
  
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Our Products</h1>
      <p className="text-gray-500 mb-6">Discover authentic Aklanon crafts and delicacies.</p>

      {/* Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Search */}
          <div className="md:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">Product Name</label>
            <input type="text" id="search" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search for items..." className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500" />
          </div>
          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Price Range (₱)</label>
            <div className="flex items-center mt-1 space-x-2">
              <input type="text" name="min" value={priceRange.min} onChange={handlePriceChange} placeholder="Min" className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500" />
              <span className="text-gray-500">-</span>
              <input type="text" name="max" value={priceRange.max} onChange={handlePriceChange} placeholder="Max" className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500" />
            </div>
          </div>
          {/* In Stock & Reset */}
          <div className="flex flex-col items-start gap-2 md:flex-row md:items-end md:justify-between">
            <div className="flex items-center pt-6">
              <input id="in-stock" type="checkbox" checked={showInStockOnly} onChange={e => setShowInStockOnly(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
              <label htmlFor="in-stock" className="ml-2 block text-sm text-gray-900">In Stock Only</label>
            </div>
             <button onClick={resetFilters} className="text-sm text-emerald-600 hover:text-emerald-800 font-medium">Reset</button>
          </div>
        </div>
      </div>

      {/* Category Buttons */}
      <div className="mb-6 flex items-center space-x-2 overflow-x-auto pb-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap ${
              selectedCategory === category
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-white text-gray-700 hover:bg-emerald-100 border border-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      
      {isTranslating && (
        <div className="flex justify-center items-center my-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            <p className="ml-3 text-gray-600">Translating descriptions...</p>
        </div>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
         {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-4 text-center py-10 text-gray-500">
              <h3 className="text-xl font-semibold">No Products Found</h3>
              <p className="mt-1">Try adjusting your filters to find what you're looking for.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopView;
