import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: '', message: '' });

        try {
            const res = await axiosInstance.post('/password-reset/', { email });
            setStatus({ type: 'success', message: res.data.message });
            setEmail('');
        } catch (err) {
            setStatus({ type: 'error', message: err.response?.data?.error || err.message || 'Something went wrong' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative min-h-[90vh] flex items-center justify-center bg-gray-50 overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-gradient-to-br from-orange-400/30 to-pink-500/30 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="w-full max-w-lg p-10 m-4 bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl relative z-10">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700 tracking-tight">Forgot Password</h1>
                    <p className="mt-3 text-base text-gray-500 font-medium">Enter your email and we'll send you a link to reset your password.</p>
                </div>

                {status.message && (
                    <div className={`mb-6 p-4 backdrop-blur-sm border-l-4 rounded-r-xl shadow-sm animate-pulse ${status.type === 'success' ? 'bg-green-50/80 border-green-500 text-green-700' : 'bg-red-50/80 border-red-500 text-red-700'}`}>
                        <p className="font-medium text-sm">{status.message}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1">
                        <label className="block text-sm font-bold text-gray-700 ml-1">Email Address</label>
                        <div className="relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-5 py-4 text-gray-800 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 focus:bg-white transition-all duration-300"
                                placeholder="john@example.com"
                                required
                            />
                        </div>
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className={`w-full py-4 mt-2 text-white font-bold rounded-2xl shadow-lg transition-all duration-300 transform flex items-center justify-center ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 hover:-translate-y-1 hover:shadow-orange-500/30'}`}
                    >
                        {isSubmitting ? 'Sending Link...' : 'Send Reset Link'}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <p className="text-sm font-medium text-gray-600">
                        Remember your password?{' '}
                        <Link to="/login" className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 transition-colors">
                            Back to Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
