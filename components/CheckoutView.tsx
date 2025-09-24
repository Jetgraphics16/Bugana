import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import type { AppContextType } from '../context/AppContext';
import { View } from '../types';

const CheckoutView: React.FC = () => {
  const { cartItems, cartTotal, setView, completeOrder, currentUser } = useContext(AppContext) as AppContextType;
  const [shippingName, setShippingName] = useState(currentUser?.name || '');
  const [shippingAddress, setShippingAddress] = useState('');
  const [cardName, setCardName] = useState(currentUser?.name || '');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (cartItems.length === 0 && !isProcessing) {
    // Redirect to shop if cart is empty and not in the middle of processing
    setView(View.SHOP);
    return null;
  }

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingName || !shippingAddress || !cardName || !cardNumber || !cardExpiry || !cardCVC) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
        completeOrder({ name: shippingName, address: shippingAddress });
        // The context will handle view change and cart clearing
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
        <button 
            onClick={() => setView(View.SHOP)}
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-800 font-medium mb-6 transition-colors"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Shop
        </button>

        <h1 className="text-3xl font-bold text-gray-800 mb-6">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left side: Form */}
            <div className="lg:col-span-3">
                <form id="payment-form" onSubmit={handlePayment} className="bg-white p-8 rounded-lg shadow-lg space-y-6">
                    {/* Shipping Details */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Shipping Information</h2>
                        <div className="space-y-4">
                             <div>
                                <label htmlFor="shippingName" className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input type="text" id="shippingName" value={shippingName} onChange={e => setShippingName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500" required />
                            </div>
                            <div>
                                <label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-700">Shipping Address</label>
                                <textarea id="shippingAddress" value={shippingAddress} onChange={e => setShippingAddress(e.target.value)} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500" placeholder="Street, City, Postal Code" required></textarea>
                            </div>
                        </div>
                    </div>

                     {/* Payment Details */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Payment Details</h2>
                         <div className="space-y-4">
                            <div>
                                <label htmlFor="cardName" className="block text-sm font-medium text-gray-700">Name on Card</label>
                                <input type="text" id="cardName" value={cardName} onChange={e => setCardName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500" required />
                            </div>
                             <div>
                                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">Card Number</label>
                                <input type="text" id="cardNumber" placeholder="0000 0000 0000 0000" value={cardNumber} onChange={e => setCardNumber(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700">Expiry (MM/YY)</label>
                                    <input type="text" id="cardExpiry" placeholder="MM/YY" value={cardExpiry} onChange={e => setCardExpiry(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500" required />
                                </div>
                                <div>
                                    <label htmlFor="cardCVC" className="block text-sm font-medium text-gray-700">CVC</label>
                                    <input type="text" id="cardCVC" placeholder="123" value={cardCVC} onChange={e => setCardCVC(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500" required />
                                </div>
                            </div>
                         </div>
                    </div>
                    {error && <p className="text-red-500 text-sm" role="alert">{error}</p>}
                </form>
            </div>
            
            {/* Right side: Order Summary */}
            <div className="lg:col-span-2">
                <div className="bg-white p-6 rounded-lg shadow-lg sticky top-24">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Order Summary</h2>
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex justify-between items-start">
                                <div className="flex items-start gap-3">
                                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-md object-cover"/>
                                    <div>
                                        <p className="font-medium text-sm text-gray-800">{item.name}</p>
                                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                                <p className="font-medium text-sm text-gray-800">₱{(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                    <div className="border-t mt-4 pt-4 space-y-2">
                        <div className="flex justify-between text-md font-medium text-gray-600">
                            <span>Subtotal</span>
                            <span>₱{cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-md font-medium text-gray-600">
                            <span>Shipping</span>
                            <span>FREE</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t mt-2">
                            <span>Total</span>
                            <span>₱{cartTotal.toFixed(2)}</span>
                        </div>
                    </div>
                     <button
                        type="submit"
                        form="payment-form"
                        disabled={isProcessing}
                        className="w-full mt-6 bg-emerald-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-emerald-700 transition-colors shadow disabled:bg-emerald-400 disabled:cursor-wait flex items-center justify-center gap-2"
                    >
                        {isProcessing ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </>
                        ) : (
                            `Pay ₱${cartTotal.toFixed(2)}`
                        )}
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default CheckoutView;