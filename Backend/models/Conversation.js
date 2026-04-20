import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    participants: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        required: true,
        index: true,
    },
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: null,
    },
    lastMessagePreview: {
        type: String,
        default: "",
    },
    unreadCount: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

conversationSchema.index({ "participants.0": 1, "participants.1": 1 }, { unique: true });
conversationSchema.pre("save", function (next) {
    if (this.participants && this.participants.length === 2) {
        this.participants = this.participants.map(id => id.toString()).sort();
    }
    next();
});

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;
