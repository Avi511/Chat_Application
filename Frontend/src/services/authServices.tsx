import apiClient from "../utils/apiClient";

export const authService = {
    async register(userData: FormData) {
        const response = await apiClient.post("/auth/register", userData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },
    async login(userData: { email: string, password: string }) {
        const response = await apiClient.post("/auth/login", userData);
        return response.data;
    },
    async logout() {
        const response = await apiClient.post("/auth/logout");
        return response.data;
    },
    async getCurrentUser() {
        const response = await apiClient.get("/auth/me");
        return response.data;
    },
    async updateProfile(userData: { fullName?: string, username?: string }) {
        const response = await apiClient.put("/auth/update-profile", userData);
        return response.data;
    },
};