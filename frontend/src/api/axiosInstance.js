import axios from 'axios';

const Baseurl = import.meta.env.VITE_BASE_URL || 'http://127.0.0.1:8000'; // Make sure this matches your django port

const axiosInstance = axios.create({
    baseURL: Baseurl,
});

// Interceptor for attaching the access token
axiosInstance.interceptors.request.use(async req => {
    let access = localStorage.getItem('access');
    if (access) {
        req.headers.Authorization = `Bearer ${access}`;
    }
    return req;
});

// Interceptor for handling 401 errors and refreshing tokens
axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        // Guard: if no response (network error), reject immediately
        if (!error.response) {
            return Promise.reject(error);
        }
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refresh = localStorage.getItem('refresh');
            if (refresh) {
                try {
                    const res = await axios.post(`${Baseurl}/token/refresh/`, { refresh });
                    if (res.status === 200) {
                        localStorage.setItem('access', res.data.access);
                        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
                        return axiosInstance(originalRequest);
                    }
                } catch (err) {
                    localStorage.removeItem('access');
                    localStorage.removeItem('refresh');
                    window.location.href = '/login';
                }
            } else {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
