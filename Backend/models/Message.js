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
    senderKey: {
        type: String,
    },
    recipientKey: {
        type: String,
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
        const conv = await mongoose.model("Conversation").findById(doc.conversationId);
        if (conv) {
            const recipientId = conv.participants.find(p => p.toString() !== doc.sender.toString());
            await mongoose.model("Conversation").findByIdAndUpdate(doc.conversationId, {
                $set: {
                    lastMessage: doc._id,
                    lastMessagePreview: {
                        content: doc.content,
                        senderKey: doc.senderKey,
                        recipientKey: doc.recipientKey,
                        timestamp: doc.createdAt
                    }
                },
                $inc: {
                    [`unreadCounts.${recipientId.toString()}`]: 1
                }
            });
        }
    } catch (error) {
        console.error("Error updating conversation after message save:", error);
    }
});

const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);
export default Message;