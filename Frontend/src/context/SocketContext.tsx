import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "../stores/authStore";
import { useConversationStore } from "../stores/conversationStore";

interface SocketContextType {
    socket: Socket | null;
    onlineUsers: string[];
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    const { user } = useAuthStore();

    useEffect(() => {
        if (user) {
            const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || "http://localhost:5000";

            const socketClient = io(baseUrl, {
                query: {
                    userId: user.id,
                },
                withCredentials: true,
                reconnectionAttempts: 3,
            });

            setSocket(socketClient);

            socketClient.on("getOnlineUsers", (users: string[]) => {
                setOnlineUsers(users);
            });

            socketClient.on("connect", () => {
                console.log("Socket connected:", socketClient.id);
            });

            socketClient.on("newMessage", (message) => {
                console.log("New message received:", message);

                const { activeConversationId, addMessage, fetchConversations } = useConversationStore.getState();

                if (activeConversationId === message.conversationId) {
                    addMessage(message);
                }

                fetchConversations();
            });

            return () => {
                socketClient.close();
                setSocket(null);
            };
        } else {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [user]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};
