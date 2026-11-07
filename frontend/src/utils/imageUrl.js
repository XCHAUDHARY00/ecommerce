export const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://ecommercackend.vercel.app';
export const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800';

export function getImageUrl(image) {
    if (!image) return FALLBACK_IMAGE;
    if (typeof image === 'string' && image.startsWith('http')) return image;
    const cleanBase = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
    const cleanPath = String(image).startsWith('/') ? image : `/${image}`;
    return `${cleanBase}${cleanPath}`;
}
