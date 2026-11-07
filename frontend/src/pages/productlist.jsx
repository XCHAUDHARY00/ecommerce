import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "../components/productcard";
import axiosInstance from "../api/axiosInstance";

function Productlist() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const searchQuery = queryParams.get("search") || "";
        const categoryQuery = queryParams.get("category") || "";

        let url = '/products/';
        const params = new URLSearchParams();
        if (searchQuery) params.append("search", searchQuery);
        if (categoryQuery) params.append("category", categoryQuery);

        const queryString = params.toString();
        if (queryString) {
            url += `?${queryString}`;
        }

        axiosInstance.get(url)
            .then((response) => {
                const data = Array.isArray(response.data) ? response.data : (response.data?.results || []);
                setProducts(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.response?.data?.error || err.message || "Failed to fetch products");
                setLoading(false);
            });
    }, [location.search]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[70vh]">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-[70vh] text-red-500 text-xl font-medium bg-red-50 m-8 rounded-3xl">
                {error}
            </div>
        );
    }

    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get("search");
    const categoryQuery = queryParams.get("category");

    return (
        <div className="bg-gray-50 pb-20">
            {/* Hero Section */}
            {!searchQuery && !categoryQuery && (
                <div className="relative overflow-hidden bg-white mb-16">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-orange-50 to-transparent"></div>
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-orange-400/20 to-pink-500/20 rounded-full blur-3xl"></div>
                    
                    <div className="max-w-7xl mx-auto px-6 py-16 sm:py-24 relative z-10 flex flex-col lg:flex-row items-center">
                        <div className="w-full lg:w-1/2 mb-12 lg:mb-0">
                            <span className="inline-block py-1 px-3 rounded-full bg-orange-100 text-orange-600 font-semibold text-sm tracking-wide mb-6">Season Exclusive</span>
                            <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-tight mb-8">
                                Redefine Your <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">Aesthetic.</span>
                            </h1>
                            <p className="text-xl text-gray-600 mb-10 leading-relaxed font-medium max-w-lg">
                                Curated fashion and premium essentials crafted for the modern lifestyle. Stand out with pieces that speak for themselves.
                            </p>
                        </div>
                        
                        {/* Moving Banner (Marquee) */}
                        <div className="w-full lg:w-1/2 relative overflow-hidden h-[450px] flex items-center">
                            {/* Gradient masks for smooth fade */}
                            <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-white to-transparent z-20"></div>
                            <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-white to-transparent z-20 lg:hidden"></div>
                            <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-orange-50 to-transparent z-20 hidden lg:block"></div>
                            
                            <div className="flex animate-[scrollX_20s_linear_infinite] whitespace-nowrap space-x-6 items-center">
                                {/* Duplicate array to create infinite scroll effect */}
                                {[...products.slice(0, 5), ...products.slice(0, 5)].map((product, idx) => (
                                    <div key={`${product.id}-${idx}`} className="inline-block w-64 h-96 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex-shrink-0 flex flex-col transform hover:-translate-y-3 transition-transform duration-300">
                                        <div className="h-64 bg-gray-50 flex items-center justify-center overflow-hidden">
                                            <img 
                                                src={product.image?.startsWith('http') ? product.image : `${Baseurl}${product.image}`} 
                                                alt={product.name} 
                                                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="p-5 bg-white flex-1 border-t border-gray-50">
                                            <p className="text-lg font-bold text-gray-900 truncate">{product.name}</p>
                                            <p className="text-lg font-black text-orange-500 mt-1">₹{product.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes scrollX {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(calc(-50% - 0.75rem)); }
                }
            `}} />

            {/* List Header */}
            <div className="max-w-7xl mx-auto px-6 mb-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200 pb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">
                            {searchQuery 
                                ? `Search Results for "${searchQuery}"` 
                                : categoryQuery 
                                    ? `${categoryQuery} Collection` 
                                    : 'Trending Now'}
                        </h2>
                        <p className="text-gray-500 mt-2 font-medium">
                            Showing {products.length} {products.length === 1 ? 'product' : 'products'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="max-w-7xl mx-auto px-6">
                {products.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-50 rounded-full mb-6">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
                        <p className="text-gray-500">Try adjusting your search or category filters.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Productlist;