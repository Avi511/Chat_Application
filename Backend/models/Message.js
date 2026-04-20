import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
        required: true,
        index: true,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    content: {
        type: String,
        required: true,
    },
    readBy: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: [],
    },
}, { timestamps: true });

messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ sender: 1, createdAt: -1 });
messageSchema.post("save", async function (doc) {
    try {
        const conversation = mongoose.model("Conversation");
        const preview = {
            content: doc.content,
            timestamps: doc.createdAt
        }
        await conversation.findByIdAndUpdate(doc.conversationId, {
            lastMessage: doc._id,
            lastMessagePreview: preview
        });
    } catch (error) {
        console.error("Error updating conversation after message save:", error);
    }
});

const Message = mongoose.model("Message", messageSchema);
export default Message;