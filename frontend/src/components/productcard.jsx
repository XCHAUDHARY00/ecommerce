import { Link } from "react-router-dom";
import { getImageUrl } from "../utils/imageUrl";

function ProductCard({ product }) {
    const imageUrl = getImageUrl(product?.image);

    return (
        <Link to={`/product/${product.id}`} className="group block h-full">
            <div className="bg-white rounded-3xl shadow-sm hover:shadow-2xl border border-gray-100 transition-all duration-300 overflow-hidden h-full flex flex-col transform hover:-translate-y-2">
                {/* Image Container */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover object-top drop-shadow-md transform group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    {/* Category Badge overlay (optional, if category data is available) */}
                    {product.category && (
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">{product.category.name}</span>
                        </div>
                    )}
                </div>

                {/* Content Container */}
                <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-gray-900 leading-snug line-clamp-2 mb-2 group-hover:text-orange-500 transition-colors">
                        {product.name}
                    </h3>
                    
                    <div className="mt-auto flex items-end justify-between pt-4">
                        <div>
                            <p className="text-sm text-gray-500 font-medium mb-1">Price</p>
                            <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
                                ₹{product.price}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-pink-500 transition-all duration-300 shadow-sm">
                            <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default ProductCard;