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

                const privateKeyName = `prv_key_${user.id}`;
                const storedPrivateKey = localStorage.getItem(privateKeyName);

                try {
                    // 1. If we have everything, verify they match.
                    if (storedPrivateKey && user.publicKey) {
                        const keysMatch = await CryptoUtils.verifyKeyPair(
                            user.publicKey,
                            storedPrivateKey
                        );

                        if (keysMatch) {
                            console.log("E2EE: Keys verified and matching.");
                            return;
                        }
                        
                        console.warn("E2EE: Key mismatch detected. Generating new keys...");
                    }

                    // 2. If we have a private key but server is missing public key, re-upload it.
                    if (storedPrivateKey && !user.publicKey) {
                        console.log("E2EE: Server missing public key. Re-uploading from local storage...");
                        const publicKey = CryptoUtils.publicKeyFromPrivateKey(storedPrivateKey);
                        const formData = new FormData();
                        formData.append("publicKey", publicKey);

                        const response = await authService.updateProfile(formData);
                        set({ user: response.user });
                        return;
                    }

                    // 3. If private key is missing or keys mismatched, generate a fresh pair.
                    console.log("E2EE: Generating fresh key pair...");
                    const keyPair = await CryptoUtils.generateKeyPair();

                    const publicKey = await CryptoUtils.exportPublicKey(keyPair.publicKey);
                    const privateKey = await CryptoUtils.exportPrivateKey(keyPair.privateKey);

                    localStorage.setItem(privateKeyName, privateKey);

                    const formData = new FormData();
                    formData.append("publicKey", publicKey);

                    const response = await authService.updateProfile(formData);
                    set({ user: response.user });

                    console.log("E2EE setup complete.");
                } catch (error) {
                    console.error("E2EE setup error:", error);
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