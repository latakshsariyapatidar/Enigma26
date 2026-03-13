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

const resetAuthAndRedirect = () => {
    try {
        localStorage.clear();
        sessionStorage.clear();

        // Expire all non-HttpOnly cookies that are accessible from JS.
        document.cookie.split(';').forEach((cookie) => {
            const name = cookie.split('=')[0]?.trim();
            if (!name) return;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        });
    } catch {
        // Ignore storage access issues and still force a fresh login flow.
    }

    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
        window.location.replace('/');
    }
};

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
        if (error.response?.status === 401 && !originalRequest?._retry) {
            // If refresh-token itself fails with 401, force re-auth immediately.
            if (originalRequest?.url?.includes('/users/refresh-token')) {
                resetAuthAndRedirect();
                return Promise.reject(error);
            }

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
                resetAuthAndRedirect();
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // Any other unrecoverable unauthorized state should return user to login.
        if (error.response?.status === 401) {
            resetAuthAndRedirect();
        }

        return Promise.reject(error);
    }
);

export default api;
