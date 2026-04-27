import { handleNewConversation, notifyConversationOnlineStatus } from "./socket/socketConversation.js";

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

            await notifyConversationOnlineStatus(io, socket, Object.keys(userSocketMap));

            socket.on("disconnect", () => {
                console.log(`User disconnected: ${userId}`);
                delete userSocketMap[userId];
                io.emit("getOnlineUsers", Object.keys(userSocketMap));
            });

        } catch (error) {
            console.error("Socket connection error:", error);
            socket.disconnect();
        }
    })
}