import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {useCart} from "../context/Cartcontext.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import axiosInstance from "../api/axiosInstance";
import { getImageUrl } from "../utils/imageUrl";

function Productdetails() {
    const { id } = useParams();
    const { addProduct } = useCart();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAdded, setIsAdded] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        axiosInstance.get(`/products/${id}/`)
            .then((response) => {
                setProduct(response.data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.response?.data?.error || err.message || "Product not found");
                setLoading(false);
            });
    }, [id]);

    const handleAddToCart = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        addProduct(product);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[80vh]">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[80vh] px-4">
                <div className="bg-red-50 p-8 rounded-3xl text-center max-w-md w-full border border-red-100 shadow-sm">
                    <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                    </div>
                    <p className="text-red-600 text-xl font-bold mb-6">{error}</p>
                    <Link to="/" className="inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors">
                        &larr; Back to Products
                    </Link>
                </div>
            </div>
        );
    }

    if (!product) return null;

    const imageUrl = getImageUrl(product.image);

    return (
        <>
        <div className="min-h-screen bg-gray-50 pb-24 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-full md:w-1/2 h-[500px] bg-gradient-to-bl from-orange-200/40 via-pink-200/20 to-transparent blur-3xl pointer-events-none transform -skew-y-12"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-200/30 to-purple-200/30 blur-3xl pointer-events-none rounded-full"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10">
                <Link to="/" className="inline-flex items-center text-gray-500 hover:text-orange-500 font-medium transition duration-200 mb-8 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-100">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                    Back to Collection
                </Link>
                
                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/50 flex flex-col lg:flex-row">
                    
                    {/* Image Section */}
                    <div className="lg:w-1/2 relative min-h-[500px] lg:min-h-[700px] flex justify-center items-center bg-gray-50 group overflow-hidden">
                        {/* Abstract background shape behind image */}
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
                        
                        <img
                            src={imageUrl}
                            alt={product.name}
                            className="relative z-10 w-full h-full object-cover object-top drop-shadow-sm transform group-hover:scale-105 transition-all duration-700 ease-out cursor-zoom-in"
                            onClick={() => setIsFullscreen(true)}
                        />
                        
                        {/* Fullscreen Expand Button */}
                        <button 
                            onClick={() => setIsFullscreen(true)}
                            className="absolute bottom-6 right-6 z-20 bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg border border-gray-100 text-gray-700 hover:text-orange-500 hover:scale-110 transition-all duration-300"
                            title="View Fullscreen"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/></svg>
                        </button>
                        
                        {product.category && (
                            <div className="absolute top-6 left-6 z-20">
                                <span className="inline-block bg-white/90 backdrop-blur-md text-gray-800 text-xs px-4 py-2 rounded-full font-black uppercase tracking-widest shadow-sm border border-gray-100">
                                    {product.category.name}
                                </span>
                            </div>
                        )}
                    </div>
                    
                    {/* Content Section */}
                    <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center relative">
                        {/* Decorative subtle pattern */}
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                            <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="50" cy="50" r="40" stroke="url(#paint0_linear)" strokeWidth="20" strokeDasharray="10 10"/>
                                <defs>
                                    <linearGradient id="paint0_linear" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#F97316" />
                                        <stop offset="1" stopColor="#EC4899" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>

                        <div className="mb-2 inline-flex items-center">
                            <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                ))}
                            </div>
                            <span className="text-gray-400 text-sm ml-2 font-medium">(Premium Quality)</span>
                        </div>
                        
                        <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight tracking-tight">
                            {product.name}
                        </h1>
                        
                        <div className="flex items-baseline mb-8">
                            <span className="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
                                ₹{product.price}
                            </span>
                            <span className="ml-3 text-lg text-gray-400 font-medium line-through">
                                ₹{(product.price * 1.2).toFixed(2)}
                            </span>
                        </div>
                        
                        <div className="mb-10 relative">
                            <div className="w-12 h-1 bg-gradient-to-r from-orange-500 to-pink-500 mb-6 rounded-full"></div>
                            <h3 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wider">Product Details</h3>
                            <p className="text-gray-600 leading-relaxed text-lg font-medium">
                                {product.description || "Experience the perfect blend of style and functionality. This premium item has been meticulously crafted to elevate your daily routine, offering unparalleled quality that speaks for itself."}
                            </p>
                        </div>
                        
                        <div className="mt-auto pt-6 flex space-x-4">
                            <button 
                                onClick={handleAddToCart}
                                disabled={isAdded}
                                className={`flex-1 py-5 px-8 rounded-2xl font-black text-lg transition-all duration-300 transform flex items-center justify-center shadow-xl ${
                                    isAdded 
                                    ? 'bg-green-500 text-white shadow-green-500/30' 
                                    : 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white hover:shadow-orange-500/40 hover:-translate-y-1'
                                }`}
                            >
                                {isAdded ? (
                                    <>
                                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                                        Added to Cart
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                                        Add to Cart - ₹{product.price}
                                    </>
                                )}
                            </button>
                        </div>
                        
                        {/* Features List */}
                        <div className="mt-10 grid grid-cols-2 gap-4 border-t border-gray-100 pt-8">
                            <div className="flex items-center text-gray-600">
                                <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center mr-3">
                                    <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                                </div>
                                <span className="font-medium text-sm">Premium Quality</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center mr-3">
                                    <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                </div>
                                <span className="font-medium text-sm">Fast Shipping</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
            
            {/* Fullscreen Image Modal */}
            {isFullscreen && (
                <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8">
                    <button 
                        onClick={() => setIsFullscreen(false)}
                        className="absolute top-6 right-6 z-50 text-white/70 hover:text-white bg-black/50 hover:bg-black p-3 rounded-full transition-all duration-300"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                    
                    <div className="relative w-full h-full flex items-center justify-center" onClick={() => setIsFullscreen(false)}>
                        <img
                            src={imageUrl}
                            alt={product.name}
                            className="max-w-full max-h-full object-contain drop-shadow-2xl cursor-zoom-out"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}
        </>
    );
}

export default Productdetails;
