import mongoose from "mongoose";

const friendshipSchema = new mongoose.Schema({
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    }
}, { timestamps: true });

friendshipSchema.index({ requester: 1, receiver: 1 }, { unique: true });

const Friendship = mongoose.models.Friendship || mongoose.model("Friendship", friendshipSchema);
export default Friendship;