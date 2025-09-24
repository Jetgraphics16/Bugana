import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import type { AppContextType } from '../context/AppContext';
import ProductCard from './ProductCard';
import ProductReviews from './ProductReviews';
import { getRecommendedProducts } from '../services/recommendationService';

const ProductDetailView: React.FC = () => {
  const { selectedProduct, setSelectedProduct, addToCart, language, isTranslating, products } = useContext(AppContext) as AppContextType;
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // If no product is selected, something went wrong. Don't render anything or redirect.
  if (!selectedProduct) {
    return null; 
  }

  // Reset quantity and added status, and scroll to top when product changes
  useEffect(() => {
      setQuantity(1);
      setIsAdded(false);
      window.scrollTo(0, 0);
  }, [selectedProduct]);

  // Find recommended products using the new content-based algorithm
  const recommendedProducts = getRecommendedProducts(selectedProduct, products, 4);

  const handleAddToCart = () => {
    if (!selectedProduct.inStock) return;
    addToCart(selectedProduct, quantity);
    setIsAdded(true);
    setTimeout(() => {
        setIsAdded(false);
    }, 2000);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0) {
      setQuantity(value);
    }
  };
  
  const description = selectedProduct.descriptions[language] || selectedProduct.descriptions['en'];

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
        <button 
            onClick={() => setSelectedProduct(null)}
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-800 font-medium mb-6 transition-colors"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Shop
        </button>

      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Image */}
          <div className="p-4">
            <img 
              src={selectedProduct.image.replace('/400/400', '/800/600')} // Request a larger image
              alt={selectedProduct.name} 
              className="w-full h-auto object-cover rounded-lg aspect-square" 
            />
          </div>
          
          {/* Product Details */}
          <div className="p-6 flex flex-col justify-center">
            <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">{selectedProduct.category}</span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 my-2">{selectedProduct.name}</h1>
            <p className="text-gray-600 text-base leading-relaxed my-4 min-h-[6rem]">
                 {isTranslating ? 
                    <span className="animate-pulse bg-gray-200 rounded-md block h-4 w-3/4 my-1"></span> 
                    : description
                }
            </p>

            <div className="my-4">
              <span className="text-4xl font-extrabold text-gray-900">₱{selectedProduct.price.toFixed(2)}</span>
              { !selectedProduct.inStock && 
                <span className="ml-4 text-lg font-bold text-red-600">Out of Stock</span>
              }
            </div>

            {/* Add to Cart Controls */}
            { selectedProduct.inStock && (
                 <div className="flex items-center space-x-4 mt-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                        <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-l-lg">-</button>
                        <input 
                            type="number"
                            value={quantity}
                            onChange={handleQuantityChange}
                            min="1"
                            className="w-16 text-center border-none focus:ring-0"
                            aria-label="Product quantity"
                        />
                        <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-r-lg">+</button>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={isAdded}
                        className={`flex-grow px-6 py-3 rounded-lg text-base font-semibold transition-all duration-300 flex items-center justify-center ${
                            isAdded 
                            ? 'bg-green-500 text-white' 
                            : 'bg-emerald-600 text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50'
                        }`}
                        >
                        {isAdded ? (
                            <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Added to Cart!
                            </>
                        ) : (
                            'Add to Cart'
                        )}
                    </button>
                </div>
            )}
          </div>
        </div>
      </div>

      {/* Recommended Products Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Recommended For You</h2>
        {recommendedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500 bg-white rounded-lg shadow-sm border">
            <p>No recommendations found.</p>
          </div>
        )}
      </div>

      {/* Customer Reviews Section */}
      <ProductReviews productId={selectedProduct.id} />

    </div>
  );
};

export default ProductDetailView;