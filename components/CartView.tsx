import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import type { AppContextType } from '../context/AppContext';
import type { CartItem } from '../types';
import { View } from '../types';

const CartView: React.FC = () => {
    const { cartItems, removeFromCart, updateCartQuantity, cartTotal, setIsCartOpen, clearCart, setView } = useContext(AppContext) as AppContextType;

    const ICONS = {
        CLOSE: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        ),
        TRASH: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
            </svg>
        )
    };
    
    const handleCheckout = () => {
        setIsCartOpen(false);
        setView(View.CHECKOUT);
    };

    const CartItemRow: React.FC<{ item: CartItem }> = ({ item }) => (
        <div className="flex items-center py-4 border-b border-gray-200">
            <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
            <div className="flex-grow ml-4">
                <p className="font-semibold text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-500">₱{item.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center space-x-2">
                <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateCartQuantity(item.id, parseInt(e.target.value, 10))}
                    className="w-16 text-center border border-gray-300 rounded-md p-1"
                />
                <button onClick={() => removeFromCart(item.id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                    {ICONS.TRASH}
                </button>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-end" onClick={() => setIsCartOpen(false)}>
            <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center p-5 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>
                    <button onClick={() => setIsCartOpen(false)} className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
                        {ICONS.CLOSE}
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto px-5">
                    {cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <h3 className="text-lg font-semibold">Your cart is empty</h3>
                            <p className="text-sm">Add some products to get started!</p>
                        </div>
                    ) : (
                        cartItems.map(item => <CartItemRow key={item.id} item={item} />)
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="p-5 border-t border-gray-200 bg-gray-50">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-lg font-medium text-gray-600">Subtotal:</span>
                            <span className="text-2xl font-bold text-emerald-600">₱{cartTotal.toFixed(2)}</span>
                        </div>
                         <button 
                            onClick={handleCheckout}
                            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-emerald-700 transition-colors shadow">
                            Proceed to Checkout
                        </button>
                        <button onClick={() => clearCart()} className="w-full text-center text-gray-500 mt-3 text-sm hover:text-red-500">
                            Clear Cart
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartView;