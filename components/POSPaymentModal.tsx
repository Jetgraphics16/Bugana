import React, { useState } from 'react';

interface POSPaymentModalProps {
    total: number;
    onClose: () => void;
    onSuccess: () => void;
}

const POSPaymentModal: React.FC<POSPaymentModalProps> = ({ total, onClose, onSuccess }) => {
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
    const [isProcessing, setIsProcessing] = useState(false);
    const [cashReceived, setCashReceived] = useState('');
    
    const handlePayment = () => {
        setIsProcessing(true);
        // Simulate processing
        setTimeout(() => {
            setIsProcessing(false);
            onSuccess();
        }, 1500);
    };

    const change = parseFloat(cashReceived) - total;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="pos-payment-title">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 m-4" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center border-b pb-3">
                    <h2 id="pos-payment-title" className="text-2xl font-bold text-gray-800">Complete Payment</h2>
                     <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200" aria-label="Close modal">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="mt-4">
                    <p className="text-center text-gray-600 text-lg">Total Amount Due</p>
                    <p className="text-center text-5xl font-extrabold text-emerald-600 my-2">₱{total.toFixed(2)}</p>

                    <div className="my-6">
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Payment Method</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => setPaymentMethod('cash')} className={`p-4 border-2 rounded-lg text-center font-semibold transition-all ${paymentMethod === 'cash' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 hover:border-gray-400'}`}>
                                Cash
                            </button>
                             <button onClick={() => setPaymentMethod('card')} className={`p-4 border-2 rounded-lg text-center font-semibold transition-all ${paymentMethod === 'card' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 hover:border-gray-400'}`}>
                                Card
                            </button>
                        </div>
                    </div>

                    {paymentMethod === 'cash' && (
                        <div className="space-y-4 animate-fade-in">
                            <div>
                                <label htmlFor="cashReceived" className="block text-sm font-medium text-gray-700">Cash Received (₱)</label>
                                <input type="number" id="cashReceived" value={cashReceived} onChange={e => setCashReceived(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-lg" placeholder="0.00"/>
                            </div>
                            {change >= 0 && cashReceived !== '' && (
                                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
                                    <p className="text-sm text-blue-700">Change Due</p>
                                    <p className="font-bold text-xl text-blue-800">₱{change.toFixed(2)}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {paymentMethod === 'card' && (
                        <div className="space-y-4 animate-fade-in">
                            <p className="text-sm text-gray-500 text-center">Please use card terminal to complete payment.</p>
                            {/* In a real app, this would integrate with a card reader SDK */}
                        </div>
                    )}
                </div>

                <div className="mt-6 pt-4 border-t">
                     <button
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-emerald-700 transition-colors shadow disabled:bg-emerald-400 disabled:cursor-wait flex items-center justify-center gap-2"
                    >
                         {isProcessing ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Processing...
                            </>
                        ) : (
                            'Confirm Payment'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default POSPaymentModal;