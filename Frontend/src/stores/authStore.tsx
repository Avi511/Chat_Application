import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "../services/authServices";

export type User = {
    id: string;
    name: string;
    username: string;
    email: string;
    avatar?: string;
    bio?: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
};

interface AuthStore {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    setUser: (user: User | null) => void;
    register: (userData: { name: string; username: string; email: string; password: string }) => Promise<void>;
    login: (userData: { identifier: string; password: string }) => Promise<void>;
    logout: () => Promise<void>;
    getCurrentUser: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            setUser: (user) =>
                set({
                    user,
                    isAuthenticated: !!user,
                }),

            register: async (userData) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await authService.register(userData);
                    set({
                        user: response.user,
                        token: response.token,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } catch (error: any) {
                    set({
                        error: error?.message || "Registration failed",
                        isLoading: false,
                    });
                }
            },

            login: async (userData) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await authService.login(userData);
                    set({
                        user: response.user,
                        token: response.token,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } catch (error: any) {
                    set({
                        error: error?.message || "Login failed",
                        isLoading: false,
                    });
                }
            },

            logout: async () => {
                set({ isLoading: true, error: null });
                try {
                    await authService.logout();
                    set({
                        user: null,
                        token: null,
                        isAuthenticated: false,
                        isLoading: false,
                    });
                } catch (error: any) {
                    set({
                        error: error?.message || "Logout failed",
                        isLoading: false,
                    });
                }
            },

            getCurrentUser: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await authService.getCurrentUser();
                    set({
                        user: response.user,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } catch (error: any) {
                    set({
                        error: error?.message || "Failed to fetch user",
                        isLoading: false,
                        user: null,
                        isAuthenticated: false,
                    });
                }
            },
        }),
        {
            name: "auth-storage",
        }
    )
);