import axios from "axios";

import { useAuthStore } from "../stores/authStore";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
    withCredentials: true,
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear auth state if unauthorized (e.g. token expired or user deleted)
            useAuthStore.setState({
                user: null,
                token: null,
                isAuthenticated: false,
                error: "Session expired or user not found. Please log in again."
            });
            // Force reload to redirect to login via PageGuards
            window.location.href = "/auth";
        }
        return Promise.reject(error);
    }
);

export default apiClient;