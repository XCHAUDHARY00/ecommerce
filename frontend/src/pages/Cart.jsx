import { useCart } from "../context/Cartcontext.jsx";
import { Link } from "react-router-dom";
import { getImageUrl } from "../utils/imageUrl";

function Cart() {
    const { cart, updateQuantity, removeProduct } = useCart();

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
                <div className="text-gray-300 mb-6 p-8 bg-gray-50 rounded-full">
                    <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Your Cart is Empty</h2>
                <p className="text-gray-500 mb-8 text-center max-w-md text-lg">Looks like you haven't added anything to your cart yet. Browse our products and find something you love!</p>
                <Link to="/" className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold py-4 px-10 rounded-full shadow-lg transform transition duration-300 hover:scale-105 text-lg">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500 mb-10 tracking-tight">Shopping Cart</h1>
            
            <div className="flex flex-col lg:flex-row gap-12">
                <div className="lg:w-2/3 space-y-6">
                    {cart.map((item) => {
                        const imageUrl = getImageUrl(item.image);
                        
                        return (
                            <div key={item.id} className="group flex flex-col sm:flex-row items-center bg-white p-4 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                                <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-orange-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                
                                <div className="sm:w-36 sm:h-36 w-full h-48 mb-4 sm:mb-0 flex-shrink-0 bg-gray-50 rounded-2xl overflow-hidden p-3 flex items-center justify-center">
                                    <img src={imageUrl} alt={item.name} className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                
                                <div className="flex-grow sm:ml-8 flex flex-col justify-between w-full h-full py-2">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="pr-8">
                                            <h3 className="text-2xl font-bold text-gray-800 line-clamp-1 group-hover:text-orange-500 transition-colors">{item.name}</h3>
                                            {item.category && <span className="inline-block mt-2 bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider">{item.category.name}</span>}
                                        </div>
                                        <button 
                                            onClick={() => removeProduct(item)}
                                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-all duration-200"
                                            aria-label="Remove item"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                    
                                    <div className="flex justify-between items-end mt-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm text-gray-500 mb-1 font-medium">Quantity</span>
                                            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-1 shadow-inner">
                                                <button 
                                                    onClick={() => updateQuantity(item, Math.max(1, item.quantity - 1))}
                                                    className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-md text-gray-700 transition-all duration-200"
                                                >
                                                    <span className="text-xl font-medium">-</span>
                                                </button>
                                                <span className="w-12 text-center font-bold text-gray-800 text-lg">{item.quantity}</span>
                                                <button 
                                                    onClick={() => updateQuantity(item, item.quantity + 1)}
                                                    className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-md text-gray-700 transition-all duration-200"
                                                >
                                                    <span className="text-xl font-medium">+</span>
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div className="text-right">
                                            <p className="text-3xl font-black text-gray-900 tracking-tight">₹{(item.price * item.quantity).toFixed(2)}</p>
                                            {item.quantity > 1 && (
                                                <p className="text-sm text-gray-500 mt-1 font-medium">₹{item.price} each</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                <div className="lg:w-1/3">
                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-24 relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-gradient-to-br from-orange-100 to-pink-100 opacity-50 blur-2xl"></div>
                        
                        <h2 className="text-2xl font-extrabold text-gray-900 mb-6 pb-6 border-b border-gray-100 flex items-center">
                            <svg className="w-6 h-6 mr-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Order Summary
                        </h2>
                        
                        <div className="space-y-5 mb-8">
                            <div className="flex justify-between text-gray-600 font-medium">
                                <span>Subtotal ({cart.reduce((a, b) => a + b.quantity, 0)} items)</span>
                                <span className="text-gray-900 font-bold">₹{total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 font-medium">
                                <span>Shipping estimate</span>
                                <span className="text-green-500 font-bold bg-green-50 px-2 py-1 rounded-md">Free</span>
                            </div>
                            <div className="flex justify-between text-gray-600 font-medium">
                                <span>Tax estimate</span>
                                <span className="text-gray-900">₹0.00</span>
                            </div>
                        </div>
                        
                        <div className="border-t-2 border-dashed border-gray-200 pt-6 mb-8">
                            <div className="flex justify-between items-end">
                                <span className="text-xl font-bold text-gray-900">Order Total</span>
                                <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-pink-600 tracking-tight">₹{total.toFixed(2)}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-2 text-right">Including taxes & duties</p>
                        </div>
                        
                        <Link to="/checkout" className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold py-5 px-6 rounded-2xl shadow-lg shadow-orange-500/30 transform transition duration-300 hover:-translate-y-1 text-lg flex items-center justify-center gap-3">
                            <span>Secure Checkout</span>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </Link>
                        
                        <div className="mt-8 flex justify-center items-center space-x-6 text-gray-300">
                            <svg className="w-12 h-8" fill="currentColor" viewBox="0 0 36 24"><path d="M12.722 17.5l2.455-15.5h3.916l-2.452 15.5h-3.92zm11.758-15.28c-1.398-.53-2.997-.83-4.597-.83-5.23 0-8.913 2.72-8.946 6.62-.034 2.88 2.593 4.48 4.562 5.43 2.03.98 2.71 1.62 2.71 2.51 0 1.35-1.66 1.96-3.18 1.96-2.16 0-3.32-.34-5.07-1.12l-.71-.33-.56 3.51c1.29.6 3.65 1.13 5.92 1.15 5.56 0 9.2-2.68 9.24-6.84.03-2.27-1.32-3.99-4.39-5.42-1.83-.91-2.95-1.51-2.95-2.43.03-1.25 1.42-1.92 3.01-1.92 1.62 0 2.8.31 3.7.75l.44.2 1.07-6.75zm11.39 15.28h-3.03c-.94 0-1.65-.45-2.02-1.33l-5.74-13.95h4.1l.81 2.3h5.02l.48-2.3h3.58l-3.2 15.28zm-6.26-4.08h3.33l-1.03-4.83-1.04-4.82-1.26 9.65zm-22.95 4.08l-3.05-10.4c-.2-.73-.8-1.24-1.57-1.3l-4.93-.31v-3.5h8.17c1 0 1.9.64 2.14 1.7l2.67 13.8h-3.43z"></path></svg>
                            <svg className="w-12 h-8" fill="currentColor" viewBox="0 0 36 24"><path d="M18 1.3C8.8 1.3 1.3 8.8 1.3 18s7.5 16.7 16.7 16.7 16.7-7.5 16.7-16.7S27.2 1.3 18 1.3zm10 16.7c0 5.5-4.5 10-10 10s-10-4.5-10-10 4.5-10 10-10 10 4.5 10 10zm-10-8.3c-4.6 0-8.3 3.7-8.3 8.3s3.7 8.3 8.3 8.3 8.3-3.7 8.3-8.3-3.7-8.3-8.3-8.3zm3.3 10h-2.5v4.2h-1.7V19.7h-2.5v-1.7h2.5v-4.2h1.7v4.2h2.5v1.7z"></path></svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;
