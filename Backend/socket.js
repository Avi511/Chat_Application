import { handleNewConversation, notifyConversationOnlineStatus } from "./socket/socketConversation.js";
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
            console.log(`User connected ${userId}`);
            io.emit("getOnlineUsers", Object.keys(userSocketMap));


            handleNewConversation(socket);


            await redisService.addUserSession(userId, socket.id);

            const isOnline = await redisService.isUserOnline(userId);
            console.log(`User ${userId} is ${isOnline ? "online" : "offline"}`);

            if (!isOnline) {
                console.log(`User ${userId} is not online. Starting new session.`);
                await notifyConversationOnlineStatus(io, socket, Object.keys(userSocketMap));
            } else {
                console.log(`User ${userId} is already online. Reusing session.`);
                await notifyConversationOnlineStatus(io, socket, Object.keys(userSocketMap));
            }

            socket.on("disconnect", async () => {
                console.log(`User disconnected: ${userId}`);
                delete userSocketMap[userId];
                io.emit("getOnlineUsers", Object.keys(userSocketMap));
                await redisService.removeUserSession(userId, socket.id);
            });

        } catch (error) {
            console.error("Socket connection error:", error);
            socket.disconnect();
        }
    })
}