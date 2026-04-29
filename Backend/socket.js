import {
    notifyConversationOnlineStatus,
    conversationRequest,
    conversationMarkAsRead,
    conversationSendMessage,
    conversationTyping
} from "./socket/socketConversation.js";
import redisService from "./services/RedisService.js";
const userSocketMap = {}; // {userId: socketId}

export const initializeSocket = async (io) => {
    io.on("connection", async (socket) => {
        try {
            const userId = socket.userId;
            if (!userId) {
                throw new Error("User ID is required");
            }
            userSocketMap[userId] = socket.id;
            socket.join(userId.toString()); // Crucial: Join a room named by userId for targeted emits
            console.log(`User connected ${userId}`);
            io.emit("getOnlineUsers", Object.keys(userSocketMap));

            socket.on("conversation:request", (data) => conversationRequest(io, socket, data));
            socket.on("conversation:mark-as-read", (data) => conversationMarkAsRead(io, socket, data));
            socket.on("conversation:send-message", (data) => conversationSendMessage(io, socket, data));
            socket.on("conversation:typing", (data) => conversationTyping(io, socket, data));

            await redisService.addUserSession(userId, socket.id);

            const isOnline = await redisService.isUserOnline(userId);
            console.log(`User ${userId} is ${isOnline ? "online" : "offline"}`);

            await notifyConversationOnlineStatus(io, socket, true);

            socket.on("disconnect", async () => {
                console.log(`User disconnected: ${userId}`);
                delete userSocketMap[userId];
                io.emit("getOnlineUsers", Object.keys(userSocketMap));
                await redisService.removeUserSession(userId, socket.id);

                const isStillOnline = await redisService.isUserOnline(userId);
                if (!isStillOnline) {
                    await notifyConversationOnlineStatus(io, socket, false);
                }
            });

        } catch (error) {
            console.error("Socket connection error:", error);
            socket.disconnect();
        }
    })
}