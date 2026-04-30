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

                // Check if we already have a private key locally
                const storedPrivateKey = localStorage.getItem(`prv_key_${user.id}`);
                
                // If we have everything, we are good
                if (storedPrivateKey && user.publicKey) return;

                // If we have a public key on server but no private key locally, 
                // we can't do much for old messages, but we MUST NOT overwrite 
                // the server's public key if we want to keep consistency.
                // However, for this simple implementation, we will generate a new pair 
                // ONLY if the private key is missing.
                
                try {
                    console.log("Checking E2EE keys...");
                    
                    // IF we have a public key on the server but NO private key locally,
                    // we MUST generate a new pair and overwrite the server key.
                    // This is the only way to recover and send/receive new messages.
                    if (!storedPrivateKey) {
                        console.warn("Private key missing. Performing E2EE Hard Reset...");
                        const keyPair = await CryptoUtils.generateKeyPair();
                        const pubKeyJwk = await CryptoUtils.exportPublicKey(keyPair.publicKey);
                        const prvKeyJwk = await CryptoUtils.exportPrivateKey(keyPair.privateKey);

                        localStorage.setItem(`prv_key_${user.id}`, prvKeyJwk);

                        const formData = new FormData();
                        formData.append("publicKey", pubKeyJwk);
                        const response = await authService.updateProfile(formData);
                        set({ user: response.user });
                        
                        console.log("E2EE Hard Reset complete.");
                    } else if (!user.publicKey) {
                        // We have private key but server missed the public key
                        const privateKey = await CryptoUtils.importPrivateKey(storedPrivateKey);
                        // We can't derive public from private easily in WebCrypto JWK, 
                        // so we just generate a new pair if the public is missing.
                        localStorage.removeItem(`prv_key_${user.id}`);
                        return get().setupE2EE();
                    }

                    console.log("E2EE setup verified.");
                } catch (error) {
                    console.error("E2EE setup failed:", error);
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