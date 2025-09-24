import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import type { AppContextType } from '../context/AppContext';
import ProductModal from './AddProductModal';
import ProductAnalyticsChart from './ProductAnalyticsChart';
import AddReviewModal from './AddReviewModal';
import type { Product } from '../types';
import { UserRole } from '../types';

const SellerDashboardView: React.FC = () => {
  const { currentUser, products, removeProduct, reviews } = useContext(AppContext) as AppContextType;
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewingProduct, setReviewingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'reviews'>('dashboard');

  // In a real app, products would be filtered by the seller's ID
  const sellerProducts = products; 
  
  // Mock data for dashboard stats - in a real app this would come from sales data
  const totalRevenue = 54820.50;
  const totalOrders = 88;

  const handleDelete = (productId: number) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
        removeProduct(productId);
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  }

  const handleCloseProductModal = () => {
    setIsProductModalOpen(false);
    setEditingProduct(null); // Clear editing product on close
  }
  
  const handleAddNew = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  }
  
  const handleWriteReview = (product: Product) => {
    setReviewingProduct(product);
    setIsReviewModalOpen(true);
  }
  
  const handleCloseReviewModal = () => {
    setReviewingProduct(null);
    setIsReviewModalOpen(false);
  }

  // Determine which products the current seller has already reviewed
  const reviewedProductIds = new Set(
    reviews
      .filter(r => r.username === currentUser?.name)
      .map(r => r.productId)
  );
  
  const TabButton: React.FC<{tabId: 'dashboard' | 'reviews', label: string}> = ({tabId, label}) => (
      <button
        onClick={() => setActiveTab(tabId)}
        className={`px-4 py-2.5 text-sm font-semibold rounded-md transition-colors duration-200 ${
            activeTab === tabId
            ? 'bg-emerald-600 text-white shadow'
            : 'text-gray-600 hover:bg-gray-200'
        }`}
        role="tab"
        aria-selected={activeTab === tabId}
      >
          {label}
      </button>
  );

  return (
    <>
      <div className="max-w-7xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
        {/* Section 1: Page Header */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4 flex-shrink-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Seller Dashboard</h1>
            <p className="text-gray-500">Welcome back, {currentUser?.name}!</p>
          </div>
          {activeTab === 'dashboard' && (
             <button
                onClick={handleAddNew}
                className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-emerald-700 transition-colors shadow-md flex items-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add New Product
            </button>
          )}
        </div>
        
        {/* Tab Navigation */}
        <div className="mb-6 flex-shrink-0">
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-4" aria-label="Tabs" role="tablist">
                   <TabButton tabId="dashboard" label="My Products & Sales" />
                   <TabButton tabId="reviews" label="My Purchases & Reviews" />
                </nav>
            </div>
        </div>

        {/* Tab Content */}
        <div className="flex-grow min-h-0">
            {activeTab === 'dashboard' && (
              <div className="flex flex-col h-full">
                {/* Section 2: Stats and Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6 flex-shrink-0">
                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Revenue</h3>
                            <p className="text-3xl font-bold text-gray-800 mt-1">₱{totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Orders</h3>
                            <p className="text-3xl font-bold text-gray-800 mt-1">{totalOrders}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Products Listed</h3>
                            <p className="text-3xl font-bold text-gray-800 mt-1">{sellerProducts.length}</p>
                        </div>
                    </div>
                    <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md flex flex-col min-h-[350px]">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex-shrink-0">Sales by Category</h3>
                        <div className="flex-grow w-full h-full relative">
                            <ProductAnalyticsChart products={products} />
                        </div>
                    </div>
                </div>
                
                {/* Section 3: Products Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col flex-grow min-h-0">
                  <div className="p-6 border-b flex-shrink-0">
                    <h2 className="text-xl font-bold text-gray-800">Your Products</h2>
                  </div>
                  <div className="overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                          <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {sellerProducts.length > 0 ? sellerProducts.map((product) => (
                          <tr key={product.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <img className="h-10 w-10 rounded-lg object-cover" src={product.image} alt={product.name} />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{product.category}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm text-gray-900">₱{product.price.toFixed(2)}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {product.inStock ? 'In Stock' : 'Out of Stock'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                              <button onClick={() => handleEdit(product)} className="text-emerald-600 hover:text-emerald-900 font-semibold">Edit</button>
                              <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900 font-semibold">Delete</button>
                            </td>
                          </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="text-center py-10 text-gray-500">
                                    You haven't added any products yet.
                                </td>
                            </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'reviews' && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
                    <div className="p-6 border-b flex-shrink-0">
                        <h2 className="text-xl font-bold text-gray-800">Review Your Purchases</h2>
                        <p className="text-sm text-gray-500 mt-1">Share your feedback on products you've bought. In a real app, this would show your order history.</p>
                    </div>
                    <div className="overflow-y-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                           <thead className="bg-gray-50 sticky top-0 z-10">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Review</span></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {products.map(product => (
                                    <tr key={product.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                <img className="h-10 w-10 rounded-lg object-cover" src={product.image} alt={product.name} />
                                                </div>
                                                <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.category}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {reviewedProductIds.has(product.id) ? (
                                                <span className="text-green-600 font-semibold flex items-center justify-end gap-1.5">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    Reviewed
                                                </span>
                                            ) : (
                                                <button onClick={() => handleWriteReview(product)} className="text-emerald-600 hover:text-emerald-900 font-semibold">
                                                    Write a Review
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
      </div>
      {isProductModalOpen && <ProductModal productToEdit={editingProduct} onClose={handleCloseProductModal} />}
      {isReviewModalOpen && reviewingProduct && <AddReviewModal product={reviewingProduct} onClose={handleCloseReviewModal} />}
    </>
  );
};

export default SellerDashboardView;
