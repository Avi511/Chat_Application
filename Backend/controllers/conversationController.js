import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import Friendship from "../models/FriendShip.js";

class ConversationController {
    static async checkConnectCode(req, res) {
        try {
            const { connectCode } = req.body;
            const user = await User.findOne({ connectCode });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const conversation = await Conversation.findOne({
                participants: { $all: [req.user.id, user._id] }
            });
            if (conversation) {
                return res.status(200).json({ message: "Conversation already exists", conversation });
            }
            const newConversation = new Conversation({
                participants: [req.user.id, user._id]
            });
            await newConversation.save();
            return res.status(200).json({ message: "Conversation created successfully", conversation: newConversation });
        } catch (error) {
            console.error("Error checking connect code:", error);
            return res.status(500).json({ message: "Error checking connect code" });
        }
    }


}