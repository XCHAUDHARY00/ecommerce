import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const uid = searchParams.get('uid');
    const token = searchParams.get('token');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== passwordConfirm) {
            setStatus({ type: 'error', message: "Passwords do not match!" });
            return;
        }
        
        if (!uid || !token) {
            setStatus({ type: 'error', message: "Invalid or missing reset token." });
            return;
        }

        setIsSubmitting(true);
        setStatus({ type: '', message: '' });

        try {
            const res = await axiosInstance.post('/password-reset-confirm/', { uid, token, password });
            setStatus({ type: 'success', message: res.data.message });
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setStatus({ type: 'error', message: err.response?.data?.error || err.message || 'Failed to reset password' });
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative min-h-[90vh] flex items-center justify-center bg-gray-50 overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-gradient-to-br from-orange-400/30 to-pink-500/30 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="w-full max-w-lg p-10 m-4 bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl relative z-10">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700 tracking-tight">Set New Password</h1>
                    <p className="mt-3 text-base text-gray-500 font-medium">Please enter your new password below.</p>
                </div>

                {status.message && (
                    <div className={`mb-6 p-4 backdrop-blur-sm border-l-4 rounded-r-xl shadow-sm ${status.type === 'success' ? 'bg-green-50/80 border-green-500 text-green-700 animate-pulse' : 'bg-red-50/80 border-red-500 text-red-700'}`}>
                        <p className="font-medium text-sm">{status.message}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1">
                        <label className="block text-sm font-bold text-gray-700 ml-1">New Password</label>
                        <div className="relative">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-5 py-4 text-gray-800 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 focus:bg-white transition-all duration-300"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-1">
                        <label className="block text-sm font-bold text-gray-700 ml-1">Confirm New Password</label>
                        <div className="relative">
                            <input
                                type="password"
                                value={passwordConfirm}
                                onChange={(e) => setPasswordConfirm(e.target.value)}
                                className="w-full px-5 py-4 text-gray-800 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 focus:bg-white transition-all duration-300"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={isSubmitting || status.type === 'success'}
                        className={`w-full py-4 mt-2 text-white font-bold rounded-2xl shadow-lg transition-all duration-300 transform flex items-center justify-center ${isSubmitting || status.type === 'success' ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 hover:-translate-y-1 hover:shadow-orange-500/30'}`}
                    >
                        {isSubmitting ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <Link to="/login" className="text-sm font-bold text-gray-500 hover:text-orange-500 transition-colors">
                        Cancel and return to login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
