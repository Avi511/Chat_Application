import { createContext, useContext, useState, useEffect } from "react";
import { conversationService } from "../services/conversationService";

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

    const fetchConversations = async () => {
        setIsLoading(true);
        setIsError(false);
        try {
            const response = await conversationService.getConversations();
            setConversations(response.data);
            setFilteredConversations(response.data);
        } catch (error) {
            setIsError(true);
            console.error("Error fetching conversations:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        let filtered = [...conversations];

        if (searchType === "unread") {
            filtered = filtered.filter(conv => {
                const totalUnread = Object.values(conv.unreadCounts).reduce((acc, count) => acc + count, 0);
                return totalUnread > 0;
            });
        }
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            filtered = filtered.filter(conv =>
                conv.friend.name.toLowerCase().includes(lowerTerm) ||
                conv.friend.username.toLowerCase().includes(lowerTerm)
            );
        }

        setFilteredConversations(filtered);
    }, [searchTerm, searchType, conversations]);

    return (
        <ConversationContext.Provider value={{
            conversations,
            filteredConversations,
            searchTerm,
            setSearchTerm,
            searchType,
            setSearchType,
            isLoading,
            fetchConversations,
            isError
        }}>
            {children}
        </ConversationContext.Provider>
    );
};
