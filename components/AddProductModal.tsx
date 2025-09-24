import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import type { AppContextType } from '../context/AppContext';
import { Product, Language } from '../types';
import { generateProductDescription, translateText } from '../services/geminiService';

interface ProductModalProps {
  onClose: () => void;
  productToEdit?: Product | null;
}

const ProductModal: React.FC<ProductModalProps> = ({ onClose, productToEdit }) => {
  const { addProduct, updateProduct } = useContext(AppContext) as AppContextType;
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [tagalogDescription, setTagalogDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [inStock, setInStock] = useState(true);
  const [error, setError] = useState('');
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  const isEditMode = !!productToEdit;

  useEffect(() => {
    if (isEditMode) {
      setName(productToEdit.name);
      setPrice(productToEdit.price.toString());
      setCategory(productToEdit.category);
      setDescription(productToEdit.descriptions[Language.EN] || '');
      setTagalogDescription(productToEdit.descriptions[Language.TL] || '');
      setImageUrl(productToEdit.image);
      setInStock(productToEdit.inStock);
    }
  }, [productToEdit, isEditMode]);
  
  const handleGenerateDescription = async () => {
    if (!name || !category) {
        alert("Please enter a Product Name and Category first to generate a description.");
        return;
    }
    setIsGeneratingDesc(true);
    try {
        const generatedDesc = await generateProductDescription(name, category);
        setDescription(generatedDesc);
    } catch (err) {
        console.error(err);
        alert("There was an error generating the description. Please try again.");
    } finally {
        setIsGeneratingDesc(false);
    }
  };
  
  const handleTranslateDescription = async () => {
    if (!description) {
        alert("Please enter or generate an English description first to translate it.");
        return;
    }
    setIsTranslating(true);
    try {
        const translatedDesc = await translateText(description, Language.TL);
        setTagalogDescription(translatedDesc);
    } catch (err) {
        console.error(err);
        alert("There was an error translating the description. Please try again.");
    } finally {
        setIsTranslating(false);
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !category || !description) {
      setError('Please fill out all required fields.');
      return;
    }

    const productData = {
      name,
      price: parseFloat(price),
      category,
      image: imageUrl || `https://picsum.photos/seed/${name.replace(/\s+/g, '-')}/400/400`,
      inStock,
      descriptions: {
        ...productToEdit?.descriptions,
        [Language.EN]: description,
        [Language.TL]: tagalogDescription,
      },
    };

    if (isEditMode && productToEdit) {
        updateProduct({ ...productToEdit, ...productData });
    } else {
        addProduct(productData);
    }
    
    onClose();
  };

  const modalTitle = isEditMode ? 'Edit Product' : 'Add New Product';
  const submitButtonText = isEditMode ? 'Save Changes' : 'Add Product';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="product-modal-title">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 m-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center border-b pb-3">
          <h2 id="product-modal-title" className="text-2xl font-bold text-gray-800">{modalTitle}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200" aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div>
            <label htmlFor="product-name" className="block text-sm font-medium text-gray-700">Product Name</label>
            <input
              id="product-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label htmlFor="product-price" className="block text-sm font-medium text-gray-700">Price (₱)</label>
                <input
                id="product-price"
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                />
            </div>
            <div>
                <label htmlFor="product-category" className="block text-sm font-medium text-gray-700">Category</label>
                <input
                id="product-category"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center">
                <label htmlFor="product-description" className="block text-sm font-medium text-gray-700">Description (English)</label>
                <button
                    type="button"
                    onClick={handleGenerateDescription}
                    disabled={isGeneratingDesc}
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 disabled:text-gray-400 disabled:cursor-wait flex items-center gap-1"
                >
                    {isGeneratingDesc ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating...
                        </>
                    ) : (
                        '✨ Generate with AI'
                    )}
                </button>
            </div>
            <textarea
              id="product-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              placeholder={isGeneratingDesc ? 'AI is thinking...' : 'Enter product description'}
            ></textarea>
          </div>
           <div>
            <div className="flex justify-between items-center">
                <label htmlFor="product-description-tl" className="block text-sm font-medium text-gray-700">Description (Tagalog)</label>
                <button
                    type="button"
                    onClick={handleTranslateDescription}
                    disabled={isTranslating || !description}
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 disabled:text-gray-400 disabled:cursor-wait flex items-center gap-1"
                >
                    {isTranslating ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Translating...
                        </>
                    ) : (
                        '🌐 Translate with AI'
                    )}
                </button>
            </div>
            <textarea
              id="product-description-tl"
              rows={3}
              value={tagalogDescription}
              onChange={(e) => setTagalogDescription(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              placeholder={isTranslating ? 'AI is translating...' : 'Enter Tagalog description or translate from English'}
            ></textarea>
          </div>
           <div>
            <label htmlFor="product-image-url" className="block text-sm font-medium text-gray-700">Image URL</label>
            <input
              id="product-image-url"
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="e.g., https://picsum.photos/400"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            />
             <p className="mt-1 text-xs text-gray-500">{isEditMode ? 'Update the image URL.' : 'If left blank, a random placeholder image will be used.'}</p>
          </div>
          <div className="flex items-center">
            <input
              id="product-instock"
              type="checkbox"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
            />
            <label htmlFor="product-instock" className="ml-2 block text-sm font-medium text-gray-700">
              In Stock
            </label>
          </div>

          {error && <p className="text-red-500 text-sm" role="alert">{error}</p>}
          
          <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow"
            >
              {submitButtonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;