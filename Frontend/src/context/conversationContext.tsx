import { createContext, useContext, useState, useEffect, useMemo, useRef } from "react";
import { toast } from "sonner";
import { conversationService } from "../services/conversationService";
import { useAuthStore } from "../stores/authStore";
import { useSocket } from "./SocketContext";
export type Message = {
    messageId: string;
    senderId: string;
    content: string;
    timestamp: string;
}

export type Conversation = {
    conversationId: string;
    lastMessage: {
        content: string;
        timestamp: string;
    } | null;
    unreadCounts: Record<string, number>;
    friend: {
        id: string;
        username: string;
        fullName: string;
        avatar?: string;
        connectCode: string;
        online: boolean;
        lastSeen: string;
    };
}

type ConversationContextType = {
    conversations: Conversation[];
    filteredConversations: Conversation[];
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    searchType: "all" | "unread" | "group" | "pin";
    setSearchType: (type: "all" | "unread" | "group" | "pin") => void;
    isLoading: boolean;
    fetchConversations: () => Promise<void>;
    isError: boolean;

    activeConversationId: string | null;
    setActiveConversationId: (id: string | null) => void;
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

export const useConversationContext = () => {
    const context = useContext(ConversationContext);
    if (!context) {
        throw new Error("useConversationContext must be used within a ConversationProvider");
    }
    return context;
};

export const ConversationProvider = ({ children }: { children: React.ReactNode }) => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchType, setSearchType] = useState<"all" | "unread" | "group" | "pin">("all");
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const { isAuthenticated } = useAuthStore();
    const { socket, onlineUsers } = useSocket();

    const prevOnlineUsers = useRef<string[]>(onlineUsers);
    const conversationsRef = useRef(conversations);
    const isReadyForToasts = useRef(false);

    useEffect(() => {
        conversationsRef.current = conversations;
    }, [conversations]);

    // Prevent toast spam on initial load by waiting 3 seconds
    useEffect(() => {
        if (isAuthenticated) {
            const timer = setTimeout(() => {
                isReadyForToasts.current = true;
            }, 3000);
            return () => clearTimeout(timer);
        } else {
            isReadyForToasts.current = false;
        }
    }, [isAuthenticated]);

    // Detect when a friend comes online
    useEffect(() => {
        if (isReadyForToasts.current) {
            const newlyOnline = onlineUsers.filter(id => !prevOnlineUsers.current.includes(id));

            newlyOnline.forEach(id => {
                const friendConv = conversationsRef.current.find(c => c.friend.id === id);
                if (friendConv) {
                    toast.info(`${friendConv.friend.fullName || friendConv.friend.username} is online`, {
                        id: `online_${id}`
                    });
                }
            });
        }
        prevOnlineUsers.current = onlineUsers;
    }, [onlineUsers]);

    const fetchConversations = async () => {
        if (!isAuthenticated) return;
        setIsLoading(true);
        setIsError(false);
        try {
            const response = await conversationService.getConversations();
            // Handle different response formats from the backend safely
            const conversationsArray = Array.isArray(response) ? response : (response.data || []);
            setConversations(conversationsArray);
            setFilteredConversations(conversationsArray);
        } catch (error) {
            setIsError(true);
            console.error("Error fetching conversations:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchConversations();
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (!socket) return;

        const handleConversationAccept = (data: any) => {
            const newConversation: Conversation = {
                conversationId: data.conversationId,
                lastMessage: data.lastMessage || null,
                unreadCounts: data.unreadCounts || {},
                friend: {
                    id: data.friend.id || data.friend._id,
                    username: data.friend.username,
                    fullName: data.friend.fullName || data.friend.name,
                    avatar: data.friend.avatar,
                    connectCode: data.friend.connectCode,
                    online: data.friend.online,
                    lastSeen: data.friend.lastSeen || new Date().toISOString(),
                }
            };

            const exists = conversationsRef.current.some(c => c.conversationId === newConversation.conversationId);
            if (exists) return; // Prevent duplicate events or re-renders from adding it twice

            setConversations(prev => [newConversation, ...prev]);

            toast.success(`You are now connected with ${newConversation.friend.fullName}!`, {
                id: `connected_${newConversation.conversationId}`
            });
        };

        const handleConversationError = (data: any) => {
            toast.error(data.error || "Failed to add conversation", {
                id: "conversation_error"
            });
        };

        const handleConversationUpdate = (data: any) => {
            setConversations(prev => prev.map(conv => {
                if (conv.conversationId === data.conversationId) {
                    return {
                        ...conv,
                        lastMessage: data.lastMessage,
                        unreadCounts: data.unreadCounts || conv.unreadCounts
                    };
                }
                return conv;
            }));
        };

        const handleUnreadCountsUpdate = (data: any) => {
            setConversations(prev => prev.map(conv => {
                if (conv.conversationId === data.conversationId) {
                    return {
                        ...conv,
                        unreadCounts: data.unreadCounts
                    };
                }
                return conv;
            }));
        };

        socket.on('conversation:accept', handleConversationAccept);
        socket.on('conversation:request:error', handleConversationError);
        socket.on('conversation:update-conversation', handleConversationUpdate);
        socket.on('conversation:update-unread-counts', handleUnreadCountsUpdate);

        return () => {
            socket.off('conversation:accept', handleConversationAccept);
            socket.off('conversation:request:error', handleConversationError);
            socket.off('conversation:update-conversation', handleConversationUpdate);
            socket.off('conversation:update-unread-counts', handleUnreadCountsUpdate);
        };
    }, [socket]);

    useEffect(() => {
        if (socket && activeConversationId) {
            const activeConv = conversations.find(
                c => c.conversationId === activeConversationId || c.friend.id === activeConversationId
            );
            if (activeConv) {
                socket.emit("newConversation", { friendId: activeConv.friend.id });
            }
        }
    }, [socket, activeConversationId, conversations]);

    const conversationsWithStatus = useMemo(() => {
        return conversations.map(conv => ({
            ...conv,
            friend: {
                ...conv.friend,
                online: onlineUsers.includes(conv.friend.id)
            }
        }));
    }, [conversations, onlineUsers]);

    useEffect(() => {
        let filtered = [...conversationsWithStatus];

        if (searchType === "unread") {
            filtered = filtered.filter(conv => {
                const totalUnread = Object.values(conv.unreadCounts).reduce((acc, count) => acc + count, 0);
                return totalUnread > 0;
            });
        }
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            filtered = filtered.filter(conv =>
                conv.friend.fullName.toLowerCase().includes(lowerTerm) ||
                conv.friend.username.toLowerCase().includes(lowerTerm)
            );
        }

        setFilteredConversations(filtered);
    }, [searchTerm, searchType, conversations]);

    return (
        <ConversationContext.Provider value={{
            conversations: conversationsWithStatus,
            filteredConversations,
            searchTerm,
            setSearchTerm,
            searchType,
            setSearchType,
            isLoading,
            fetchConversations,
            isError,
            activeConversationId,
            setActiveConversationId
        }}>
            {children}
        </ConversationContext.Provider>
    );
};
