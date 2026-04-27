import Friendship from "../models/Friendship.js";
import { getChatRoom, leaveAllChatRooms } from "./helper.js";

export const handleNewConversation = (socket) => {
    socket.on('newConversation', async (data) => {
        try {
            const { friendId } = data;
            if (!friendId) {
                console.error("friendId is missing in newConversation event");
                return;
            }

            leaveAllChatRooms(socket);
            const room = await getChatRoom(socket.userId, friendId);
            socket.join(room);
            console.log(`User ${socket.userId} joined room ${room}`);

        } catch (error) {
            console.error("Error joining conversation room:", error);
        }
    });
}

export const notifyConversationOnlineStatus = async (io, socket, onlineUsers) => {
    try {
        const userId = socket.userId;

        const conversations = await Friendship.find({
            $or: [
                { requester: userId, status: "accepted" },
                { recipient: userId, status: "accepted" }
            ]
        });

        const friendIds = conversations.map(c =>
            c.requester.toString() === userId.toString()
                ? c.recipient.toString()
                : c.requester.toString()
        );

        const onlineFriends = onlineUsers.filter(id => friendIds.includes(id));

        socket.emit("getOnlineUsers", onlineFriends);
        console.log("emit:conversation:online-status");

    } catch (error) {
        console.error("Error notifying conversation online status:", error);
    }
}
