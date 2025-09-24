import React, { useContext, useState } from 'react';
import type { Product } from '../types';
import { AppContext } from '../context/AppContext';
import type { AppContextType } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, language, isTranslating, setSelectedProduct } = useContext(AppContext) as AppContextType;
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card's click event from firing
    if (!product.inStock) return;
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };
  
  const handleCardClick = () => {
      if (product.inStock) {
        setSelectedProduct(product);
      }
  }

  const description = product.descriptions[language] || product.descriptions['en'];

  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden flex flex-col relative transition-transform duration-300 group ${product.inStock ? 'hover:scale-105 cursor-pointer' : 'cursor-default'}`}
         onClick={handleCardClick}
         role="button"
         tabIndex={product.inStock ? 0 : -1}
         onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && handleCardClick()}
         aria-label={`View details for ${product.name}`}
    >
      <div className="relative h-48 w-full overflow-hidden">
        <img src={product.image} alt={product.name} className={`w-full h-full object-cover transition-all duration-300 ${!product.inStock ? 'grayscale opacity-50' : ''}`} />
        
        {!product.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                <span className="bg-gray-800 text-white text-sm font-bold px-4 py-2 rounded-md shadow-lg transform -rotate-12">
                    OUT OF STOCK
                </span>
            </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 truncate group-hover:text-emerald-600 transition-colors">{product.name}</h3>
        <p className="text-sm text-gray-500 mt-1 flex-grow min-h-[40px]">
          {isTranslating ? 
            <span className="animate-pulse bg-gray-200 rounded-md block h-4 w-full my-1"></span> 
            : description
          }
        </p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-emerald-600">₱{product.price.toFixed(2)}</span>
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock || isAdded}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center w-32 z-10 ${
                !product.inStock
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : isAdded 
                ? 'bg-green-500 text-white' 
                : 'bg-emerald-500 text-white hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50'
            }`}
            aria-label={isAdded ? 'Added to cart' : !product.inStock ? 'Product out of stock' : `Add ${product.name} to cart`}
          >
            {isAdded ? (
                <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Added
                </>
            ) : !product.inStock ? 'Out of Stock' : (
                'Add to Cart'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;