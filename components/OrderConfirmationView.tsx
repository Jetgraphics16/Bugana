import React, { useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import type { AppContextType } from '../context/AppContext';
import { View } from '../types';

const OrderConfirmationView: React.FC = () => {
    const { latestOrder, setView, currentUser } = useContext(AppContext) as AppContextType;

    useEffect(() => {
        // Redirect if there's no order to show, e.g., on page refresh
        if (!latestOrder) {
            setView(View.SHOP);
        }
        window.scrollTo(0, 0);
    }, [latestOrder, setView]);

    if (!latestOrder) {
        return null; // or a loading spinner
    }

    return (
        <div className="max-w-4xl mx-auto py-12 text-center animate-fade-in">
            <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-lg border-t-8 border-emerald-500">
                <div className="mx-auto w-20 h-20 flex items-center justify-center bg-green-100 rounded-full mb-6">
                    <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800">Thank You For Your Order!</h1>
                <p className="mt-4 text-lg text-gray-600">
                    Hi {currentUser?.name.split(' ')[0]}, your order <span className="font-semibold text-emerald-600">#{latestOrder.id.split('_')[1]}</span> has been confirmed.
                </p>
                <p className="mt-2 text-gray-500">A confirmation email will be sent to you shortly.</p>
                
                <div className="mt-8 text-left border-t pt-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Order Summary</h2>
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-2 border-b pb-4 mb-4">
                        {latestOrder.items.map(item => (
                            <div key={item.id} className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">{item.name} <span className="text-gray-400">x {item.quantity}</span></span>
                                <span className="font-medium text-gray-800">₱{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                        <span>Total Paid</span>
                        <span>₱{latestOrder.total.toFixed(2)}</span>
                    </div>
                    <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-700 mb-2">Shipping to:</h3>
                        <p className="text-gray-600">{latestOrder.shippingInfo.name}</p>
                        <p className="text-gray-600">{latestOrder.shippingInfo.address}</p>
                    </div>
                </div>

                <button 
                    onClick={() => setView(View.SHOP)}
                    className="mt-10 inline-flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors shadow"
                >
                    Continue Shopping
                </button>
            </div>
        </div>
    );
};

export default OrderConfirmationView;