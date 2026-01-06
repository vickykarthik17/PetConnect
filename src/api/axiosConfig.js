import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8082/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If the error is due to token expiration and we haven't tried to refresh yet
        if (error.response?.status === 401 && 
            error.response?.data?.error === 'Token expired' && 
            !originalRequest._retry) {
            
            originalRequest._retry = true;

            try {
                // Try to refresh the token
                const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {}, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('refreshToken')}`
                    }
                });

                const { token, refreshToken } = response.data;
                
                // Update tokens in localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('refreshToken', refreshToken);
                
                // Update the Authorization header
                originalRequest.headers.Authorization = `Bearer ${token}`;
                
                // Retry the original request
                return api(originalRequest);
            } catch (refreshError) {
                // If refresh fails, clear tokens and redirect to login
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api; 