import React, { useContext } from 'react';
import Header from './components/Header';
import ShopView from './components/ShopView';
import POSView from './components/POSView';
import CartView from './components/CartView';
import AuthView from './components/AuthView';
import SellerDashboardView from './components/SellerDashboardView';
import ProductDetailView from './components/ProductDetailView';
import Chatbot from './components/Chatbot';
import CheckoutView from './components/CheckoutView';
import OrderConfirmationView from './components/OrderConfirmationView';
import { AppContext } from './context/AppContext';
import type { AppContextType } from './context/AppContext';
import { UserRole, View } from './types';

const App: React.FC = () => {
  const { view, isCartOpen, isAuthenticated, currentUser, selectedProduct } = useContext(AppContext) as AppContextType;

  if (!isAuthenticated) {
    return <AuthView />;
  }
  
  const isCustomer = currentUser?.role === UserRole.CUSTOMER;

  const renderView = () => {
    // If a product is selected by a customer, show the detail view
    if (view === View.SHOP && selectedProduct && isCustomer) {
      return <ProductDetailView />;
    }

    switch (view) {
      case View.SHOP:
        return <ShopView />;
      case View.POS:
        // Only allow sellers to access the POS
        return currentUser?.role === UserRole.SELLER ? <POSView /> : <ShopView />;
      case View.SELLER_DASHBOARD:
        // Only allow sellers to access the Dashboard
        return currentUser?.role === UserRole.SELLER ? <SellerDashboardView /> : <ShopView />;
      case View.CHECKOUT:
        return isCustomer ? <CheckoutView /> : <ShopView />;
      case View.ORDER_CONFIRMATION:
        return isCustomer ? <OrderConfirmationView /> : <ShopView />;
      default:
        // Default to dashboard for sellers, shop for customers
        return currentUser?.role === UserRole.SELLER ? <SellerDashboardView /> : <ShopView />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8">
        {renderView()}
      </main>
      {isCartOpen && <CartView />}
      {isCustomer && <Chatbot />}
    </div>
  );
};

export default App;