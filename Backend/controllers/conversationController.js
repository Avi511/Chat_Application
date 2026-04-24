import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import Friendship from "../models/FriendShip.js";
import { connect } from "mongoose";

class ConversationController {
    static async checkConnectCode(req, res) {
        try {
            const userId = req.user.id;
            const { connectCode } = req.query;
            const friend = await User.findOne({ connectCode });
            if (!friend || friend.id === userId) {
                return res.status(404).json({ message: "Invalid connect code" });
            }
            const existFriendship = await Friendship.findOne({
                $or: [
                    { participants: [userId, friend._id] },
                    { participants: [friend._id, userId] }
                ]
            });
            if (existFriendship) {
                return res.status(400).json({ message: "You are already friends" });
            }
            res.json({
                success: true,
                message: `You have a new friend ${friend.username}`,
            })

        } catch (error) {
            console.error("Error checking connect code:", error);
            return res.status(500).json({ message: "Error checking connect code" });
        }
    }

    static async getConversations(req, res) {
        try {
            const userId = req.user.id;
            const friendships = await Friendship.find({
                $or: [
                    { requester: userId },
                    { recipient: userId }
                ],
                status: "accepted"
            }).populate([
                {
                    path: "requester",
                    select: "_id username name avatar"
                },
                {
                    path: "recipient",
                    select: "_id username name avatar"
                }
            ]).lean();

            if (friendships.length === 0) {
                return res.status(200).json([]);
            }

            const friendIds = friendships.map(friendship => {
                return friendship.requester._id.toString() === userId ? friendship.recipient._id : friendship.requester._id;
            })

            const conversations = await Conversation.find({
                participants: {
                    $all: [userId],
                    $in: friendIds,
                    $size: 2
                }
            })

            const conversationMap = new Map();
            conversations.forEach(conversation => {
                const friendId = conversation.participants.find(p => p.toString() !== userId.toString());
                if (friendId) {
                    conversationMap.set(friendId.toString(), conversation);
                }
            })

            const conversationData = (await Promise.all(
                friendships.map(async (friendship) => {
                    const isRequester = friendship.requester._id.toString() === userId.toString();
                    const friendId = isRequester ? friendship.recipient._id : friendship.requester._id;
                    const conversation = conversationMap.get(friendId.toString());

                    if (!conversation) return null;

                    return {
                        conversationId: conversation._id,
                        lastMessage: conversation.lastMessagePreview || null,
                        unreadCounts: {
                            [friendship._id.toString()]: (conversation.unreadCounts && conversation.unreadCounts.get ? conversation.unreadCounts.get(friendId.toString()) : conversation.unreadCounts[friendId.toString()]) || 0,
                        },
                        friend: {
                            _id: friendId,
                            username: isRequester ? friendship.recipient.username : friendship.requester.username,
                            name: isRequester ? friendship.recipient.name : friendship.requester.name,
                            avatar: isRequester ? friendship.recipient.avatar : friendship.requester.avatar,
                            connectCode: isRequester ? friendship.recipient.connectCode : friendship.requester.connectCode,
                            online: false,
                            lastSeen: "Recent activity", //@TODO: use redis or socket map to get real-time status
                        },
                        friendshipId: friendship._id.toString()
                    };
                })
            )).filter(item => item !== null);
            res.status(200).json({ success: true, data: conversationData });

        } catch (error) {
            console.error("Error getting conversations:", error);
            res.status(500).json({ message: "Error getting conversations" });
        }
    }
    static async getMessages(req, res) {
        try {
            const { conversationId } = req.params;
            const userId = req.user.id;

            const messages = await Message.find({ conversationId })
                .sort({ createdAt: 1 })
                .lean();

            // Clear unread counts for this user in this conversation
            await Conversation.findByIdAndUpdate(conversationId, {
                $set: {
                    [`unreadCounts.${userId.toString()}`]: 0
                }
            });

            res.status(200).json({ success: true, data: messages });
        } catch (error) {
            console.error("Error getting messages:", error);
            res.status(500).json({ message: "Error getting messages" });
        }
    }
}

export default ConversationController;
