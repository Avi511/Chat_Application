const userSocketMap = {}; // {userId: socketId}

export const initializeSocket = async (io) => {
    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
        
        if (userId && userId !== "undefined") {
            userSocketMap[userId] = socket.id;
            console.log(`User connected: ${userId} with socket ID: ${socket.id}`);
        }

        // Emit the list of online users to all connected clients
        io.emit("getOnlineUsers", Object.keys(userSocketMap));

        socket.on("disconnect", () => {
            if (userId && userId !== "undefined") {
                console.log(`User disconnected: ${userId}`);
                delete userSocketMap[userId];
            }
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        });
    })
}