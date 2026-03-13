import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api/v1',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercept 401s and attempt token refresh once
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) reject(error);
        else resolve();
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(() => api(originalRequest));
            }
            originalRequest._retry = true;
            isRefreshing = true;
            try {
                await api.post('/users/refresh-token');
                processQueue(null);
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError);
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);

export default api;
