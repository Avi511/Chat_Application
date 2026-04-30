import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "../services/authServices";
import { CryptoUtils } from "../utils/crypto";

export type User = {
    id: string;
    fullName: string;
    username: string;
    email: string;
    mobileNumber: string;
    profilePicture?: string;
    publicKey?: string;
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
    register: (userData: FormData) => Promise<void>;
    login: (userData: { email: string; password: string }) => Promise<void>;
    logout: () => Promise<void>;
    getCurrentUser: () => Promise<void>;
    updateProfile: (userData: FormData) => Promise<void>;
    setupE2EE: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
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
                        error: error?.response?.data?.message || error?.message || "Registration failed",
                        isLoading: false,
                    });
                    throw error;
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
                        error: error?.response?.data?.message || error?.message || "Login failed",
                        isLoading: false,
                    });
                    throw error;
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
                        error: error?.response?.data?.message || error?.message || "Logout failed",
                        isLoading: false,
                    });
                    throw error;
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
                        error: error?.response?.data?.message || error?.message || "Failed to fetch user",
                        isLoading: false,
                        user: null,
                        isAuthenticated: false,
                    });
                    throw error;
                }
            },
            updateProfile: async (userData) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await authService.updateProfile(userData);
                    set({
                        user: response.user,
                        isLoading: false,
                    });
                } catch (error: any) {
                    set({
                        error: error?.response?.data?.message || error?.message || "Failed to update profile",
                        isLoading: false,
                    });
                    throw error;
                }
            },
            setupE2EE: async () => {
                const { user, isLoading } = get();
                if (!user || isLoading) return;

                const storedPrivateKey = localStorage.getItem(`prv_key_${user.id}`);
                
                // 1. If we have everything, we are good
                if (storedPrivateKey && user.publicKey) return;

                // 2. If private key is missing but public key exists on server,
                // we warn and stop to prevent overwriting the server identity.
                if (!storedPrivateKey && user.publicKey) {
                    console.warn("E2EE: Private key missing from local storage. You will not be able to decrypt your message history.");
                    return;
                }

                // 3. Only generate a new pair if both are missing (Fresh Account/Setup)
                try {
                    if (!storedPrivateKey && !user.publicKey) {
                        console.log("Generating fresh E2EE key pair...");
                        const keyPair = await CryptoUtils.generateKeyPair();
                        const pubKeyJwk = await CryptoUtils.exportPublicKey(keyPair.publicKey);
                        const prvKeyJwk = await CryptoUtils.exportPrivateKey(keyPair.privateKey);

                        localStorage.setItem(`prv_key_${user.id}`, prvKeyJwk);

                        const formData = new FormData();
                        formData.append("publicKey", pubKeyJwk);
                        const response = await authService.updateProfile(formData);
                        set({ user: response.user });
                        
                        console.log("E2EE Setup Complete.");
                    }
                } catch (error) {
                    console.error("E2EE Setup Error:", error);
                }
            },
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);