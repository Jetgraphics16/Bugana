import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import type { AppContextType } from '../context/AppContext';
import { UserRole } from '../types';
import { buganaLogoBase64 } from '../assets/logo';

type AuthMode = 'login' | 'register';

const AuthView: React.FC = () => {
    const [mode, setMode] = useState<AuthMode>('login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<UserRole>(UserRole.CUSTOMER);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, register } = useContext(AppContext) as AppContextType;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const response = mode === 'login'
            ? await login(email, password)
            : await register(name, email, password, role);

        if (!response.success) {
            setError(response.message);
        }
        // On success, the App component will automatically re-render and show the main app
        setIsLoading(false);
    };

    const toggleMode = () => {
        setMode(prev => prev === 'login' ? 'register' : 'login');
        setError('');
        setName('');
        setEmail('');
        setPassword('');
        setRole(UserRole.CUSTOMER);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
            <div className="max-w-md w-full mx-auto">
                <div className="flex justify-center items-center mb-6">
                     <img src={buganaLogoBase64} alt="Bugana Logo" className="h-16 w-auto" />
                     <span className="text-4xl font-bold text-emerald-700 ml-3">Bugana</span>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-2" id="auth-heading">
                        {mode === 'login' ? 'Welcome Back!' : 'Create an Account'}
                    </h2>
                    <p className="text-center text-gray-500 mb-6">
                        {mode === 'login' ? 'Sign in to continue' : 'Join us and explore local products'}
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-4" aria-labelledby="auth-heading">
                        {mode === 'register' && (
                            <>
                                <div>
                                    <label className="text-sm font-medium text-gray-700" htmlFor="name">
                                        Full Name
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        required
                                        className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        autoComplete="name"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">Account Type</label>
                                    <div className="flex gap-4">
                                        <label htmlFor="role-customer" className="flex items-center p-3 border rounded-lg cursor-pointer flex-1 justify-center transition-all"
                                            style={{ borderColor: role === UserRole.CUSTOMER ? '#10B981' : '#D1D5DB', borderWidth: '2px' }}>
                                            <input type="radio" id="role-customer" name="role" value={UserRole.CUSTOMER} checked={role === UserRole.CUSTOMER} onChange={() => setRole(UserRole.CUSTOMER)} className="hidden" />
                                            <span className="font-medium" style={{ color: role === UserRole.CUSTOMER ? '#059669' : '#4B5563' }}>Customer</span>
                                        </label>
                                        <label htmlFor="role-seller" className="flex items-center p-3 border rounded-lg cursor-pointer flex-1 justify-center transition-all"
                                            style={{ borderColor: role === UserRole.SELLER ? '#10B981' : '#D1D5DB', borderWidth: '2px' }}>
                                            <input type="radio" id="role-seller" name="role" value={UserRole.SELLER} checked={role === UserRole.SELLER} onChange={() => setRole(UserRole.SELLER)} className="hidden" />
                                            <span className="font-medium" style={{ color: role === UserRole.SELLER ? '#059669' : '#4B5563' }}>Seller</span>
                                        </label>
                                    </div>
                                </div>
                            </>
                        )}
                        <div>
                            <label className="text-sm font-medium text-gray-700" htmlFor="email">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                autoComplete="email"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700" htmlFor="password">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                            />
                        </div>
                        
                        {error && <p className="text-red-500 text-sm text-center" role="alert">{error}</p>}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-emerald-700 transition-colors shadow disabled:bg-emerald-400 disabled:cursor-wait"
                        >
                            {isLoading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
                        </button>
                    </form>
                    <p className="text-center text-sm text-gray-600 mt-6">
                        {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
                        <button onClick={toggleMode} className="font-semibold text-emerald-600 hover:underline ml-1">
                            {mode === 'login' ? 'Sign Up' : 'Sign In'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthView;
