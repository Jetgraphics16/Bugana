import React, { useState, useContext, useMemo } from 'react';
import type { Product, CartItem } from '../types';
import { AppContext } from '../context/AppContext';
import type { AppContextType } from '../context/AppContext';
import POSPaymentModal from './POSPaymentModal';

const POSView: React.FC = () => {
    const { products } = useContext(AppContext) as AppContextType;
    const [saleItems, setSaleItems] = useState<CartItem[]>([]);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    
    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [priceRange, setPriceRange] = useState<{ min: string, max: string }>({ min: '', max: '' });
    const [showInStockOnly, setShowInStockOnly] = useState(true); // Default to true for POS

    const categories = useMemo(() => ['All', ...new Set(products.map(p => p.category))], [products]);

    const addToSale = (product: Product) => {
        if (!product.inStock) return;
        setSaleItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const updateSaleQuantity = (id: number, quantity: number) => {
        if (quantity <= 0) {
            setSaleItems(prev => prev.filter(item => item.id !== id));
        } else {
            setSaleItems(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
        }
    };
    
    const finalizeSale = () => {
        if(saleItems.length === 0) return;
        setIsPaymentModalOpen(true);
    };
    
    const handlePaymentSuccess = () => {
        // This is called from the modal on success
        alert(`Sale finalized! Total: ₱${total.toFixed(2)}`);
        setSaleItems([]);
        setIsPaymentModalOpen(false);
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (/^\d*\.?\d*$/.test(value)) {
            setPriceRange(prev => ({ ...prev, [name]: value }));
        }
    };

    const resetFilters = () => {
        setSearchTerm('');
        setSelectedCategory('All');
        setPriceRange({ min: '', max: '' });
        setShowInStockOnly(true);
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

    const total = saleItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const ICONS = {
        SEARCH: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
        TRASH: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>,
    };

    return (
        <>
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
                {/* Product Selection */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow-md flex flex-col">
                    <div className="p-4 border-b space-y-3">
                        {/* Search Bar */}
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">{ICONS.SEARCH}</span>
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        {/* Additional Filters */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {/* Category Filter */}
                            <div>
                                <label htmlFor="pos-category" className="sr-only">Category</label>
                                <select id="pos-category" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500">
                                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            {/* Price Filter */}
                            <div className="flex items-center space-x-1">
                                <label htmlFor="pos-min-price" className="sr-only">Min Price</label>
                                <input type="text" id="pos-min-price" name="min" value={priceRange.min} onChange={handlePriceChange} placeholder="Min ₱" className="w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500" />
                                <span className="text-gray-400">-</span>
                                <label htmlFor="pos-max-price" className="sr-only">Max Price</label>
                                <input type="text" id="pos-max-price" name="max" value={priceRange.max} onChange={handlePriceChange} placeholder="Max ₱" className="w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500" />
                            </div>
                            {/* Availability Filter & Reset */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input id="pos-in-stock" type="checkbox" checked={showInStockOnly} onChange={e => setShowInStockOnly(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                                    <label htmlFor="pos-in-stock" className="ml-2 block text-sm text-gray-900">In Stock Only</label>
                                </div>
                                <button onClick={resetFilters} className="text-sm text-emerald-600 hover:text-emerald-800 font-medium">Reset</button>
                            </div>
                        </div>
                    </div>
                    <div className="flex-grow p-4 overflow-y-auto">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                            {filteredProducts.map(p => (
                                <button key={p.id} onClick={() => addToSale(p)} disabled={!p.inStock} className="border rounded-lg p-2 text-center hover:shadow-lg hover:border-emerald-500 transition-all duration-200 flex flex-col items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:border-gray-200 relative">
                                    {!p.inStock && <span className="absolute top-1 right-1 bg-gray-600 text-white text-xs px-1.5 py-0.5 rounded-full">Sold</span>}
                                    <img src={p.image} alt={p.name} className="w-24 h-24 object-cover rounded-md mb-2" />
                                    <span className="text-sm font-medium text-gray-700 leading-tight">{p.name}</span>
                                    <span className="text-xs text-gray-500 mt-1">₱{p.price.toFixed(2)}</span>
                                </button>
                            ))}
                        </div>
                        {filteredProducts.length === 0 && (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-gray-500 text-center">No products match your filters.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Current Sale */}
                <div className="bg-white rounded-lg shadow-md flex flex-col">
                    <h2 className="text-xl font-bold p-4 border-b text-gray-800">Current Sale</h2>
                    <div className="flex-grow p-4 overflow-y-auto">
                        {saleItems.length === 0 ? (
                            <p className="text-gray-500 text-center mt-8">Add products to start a sale.</p>
                        ) : (
                            <ul className="divide-y divide-gray-200">
                                {saleItems.map(item => (
                                    <li key={item.id} className="py-3 flex items-center justify-between">
                                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
                                        <div className="flex-grow ml-4">
                                            <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                                            <p className="text-sm text-gray-500">₱{item.price.toFixed(2)}</p>
                                        </div>
                                        <div className="flex items-center space-x-2 ml-4">
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={e => updateSaleQuantity(item.id, parseInt(e.target.value, 10))}
                                                className="w-12 border rounded-md text-center p-1"
                                            />
                                            <button onClick={() => updateSaleQuantity(item.id, 0)} className="text-gray-400 hover:text-red-500">{ICONS.TRASH}</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="p-4 border-t bg-gray-50">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-lg font-bold text-gray-700">Total:</span>
                            <span className="text-2xl font-extrabold text-emerald-600">₱{total.toFixed(2)}</span>
                        </div>
                        <button
                            onClick={finalizeSale}
                            disabled={saleItems.length === 0}
                            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-emerald-700 transition-colors shadow disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            Finalize Sale
                        </button>
                    </div>
                </div>
            </div>
            {isPaymentModalOpen && (
                <POSPaymentModal 
                    total={total}
                    onClose={() => setIsPaymentModalOpen(false)}
                    onSuccess={handlePaymentSuccess}
                />
            )}
        </>
    );
};

export default POSView;