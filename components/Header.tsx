import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import type { AppContextType } from '../context/AppContext';
import { Language, View, UserRole } from '../types';
import { buganaLogoBase64 } from '../assets/logo';

const Header: React.FC = () => {
  const { view, setView, language, setLanguage, cartCount, setIsCartOpen, currentUser, logout } = useContext(AppContext) as AppContextType;

  const ICONS = {
    CART: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  };

  const navButtonClasses = (buttonView: View) => `px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
    view === buttonView ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-emerald-100 hover:text-emerald-800'
  }`;
  
  const isSeller = currentUser?.role === UserRole.SELLER;

  const SellerNav = () => (
    <>
      <button onClick={() => setView(View.SELLER_DASHBOARD)} className={navButtonClasses(View.SELLER_DASHBOARD)}>
        Dashboard
      </button>
      <button onClick={() => setView(View.POS)} className={navButtonClasses(View.POS)}>
        POS System
      </button>
    </>
  );

  const CustomerNav = () => (
    <button onClick={() => setView(View.SHOP)} className={navButtonClasses(View.SHOP)}>
      Shop
    </button>
  );

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => setView(isSeller ? View.SELLER_DASHBOARD : View.SHOP)}>
                <img src={buganaLogoBase64} alt="Bugana Logo" className="h-10 w-auto" />
                <span className="text-2xl font-bold text-emerald-700 ml-2 hidden sm:inline">Bugana</span>
            </div>
            <nav className="hidden md:flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
                { isSeller ? <SellerNav/> : <CustomerNav/> }
            </nav>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
             <div className="flex items-center bg-gray-100 p-1 rounded-lg">
                <button 
                  onClick={() => setLanguage(Language.EN)} 
                  className={`px-3 py-1 text-sm rounded ${language === Language.EN ? 'bg-emerald-600 text-white shadow' : 'text-gray-600'}`}
                >
                  EN
                </button>
                <button 
                  onClick={() => setLanguage(Language.TL)} 
                  className={`px-3 py-1 text-sm rounded ${language === Language.TL ? 'bg-emerald-600 text-white shadow' : 'text-gray-600'}`}
                >
                  TL
                </button>
            </div>

            {!isSeller && (
              <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-2 text-gray-600 hover:text-emerald-700 hover:bg-emerald-100 rounded-full transition-colors"
                  aria-label="Open cart"
              >
                {ICONS.CART}
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            <div className="border-l border-gray-200 pl-2 sm:pl-4 sm:ml-2">
                <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-3 hidden sm:inline" aria-label="Current user">
                        Hi, {currentUser?.name.split(' ')[0]}
                    </span>
                    <button
                        onClick={logout}
                        className="px-3 py-1.5 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-200"
                        aria-label="Logout"
                    >
                        Logout
                    </button>
                </div>
            </div>
          </div>
        </div>
        <div className="md:hidden flex items-center space-x-2 bg-gray-100 p-1 rounded-lg mb-2 justify-center">
             { isSeller ? <SellerNav/> : <CustomerNav/> }
        </div>
      </div>
    </header>
  );
};

export default Header;
