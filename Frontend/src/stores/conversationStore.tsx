import { create } from "zustand";
import { conversationService } from "../services/conversationService";

interface Conversation {
    conversationId: string;
    lastMessage: {
        content: string;
        timestamp: string;
    } | null;
    unreadCounts: Record<string, number>;
    friend: {
        _id: string;
        username: string;
        name: string;
        avatar?: string;
        connectCode: string;
        online: boolean;
        lastSeen: string;
    };
    friendshipId: string;
}

interface ConversationStore {
    conversations: Conversation[];
    messages: any[];
    activeConversationId: string | null;
    isLoading: boolean;
    error: string | null;
    fetchConversations: () => Promise<void>;
    fetchMessages: (conversationId: string) => Promise<void>;
    setActiveConversation: (id: string | null) => void;
    addMessage: (message: any) => void;
}

export const useConversationStore = create<ConversationStore>((set, get) => ({
    conversations: [],
    messages: [],
    activeConversationId: null,
    isLoading: false,
    error: null,

    fetchConversations: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await conversationService.getConversations();
            set({ conversations: response.data, isLoading: false });
        } catch (error: any) {
            set({ 
                error: error?.response?.data?.message || error?.message || "Failed to fetch conversations", 
                isLoading: false 
            });
        }
    },

    fetchMessages: async (conversationId) => {
        set({ isLoading: true, error: null });
        try {
            // Assuming there's a getMessages in conversationService
            const response = await conversationService.getMessages(conversationId);
            set({ messages: response.data, isLoading: false });
        } catch (error: any) {
            set({ 
                error: error?.response?.data?.message || error?.message || "Failed to fetch messages", 
                isLoading: false 
            });
        }
    },

    setActiveConversation: (id) => {
        set({ activeConversationId: id, messages: [] });
        if (id) {
            get().fetchMessages(id);
        }
    },

    addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
}));
