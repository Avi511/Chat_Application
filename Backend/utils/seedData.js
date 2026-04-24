import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import User from "../models/User.js";
import Friendship from "../models/FriendShip.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

import { connectDB } from "./db.js";

async function resetDatabase() {
    await Message.deleteMany({});
    await Conversation.deleteMany({});
    await Friendship.deleteMany({});
    await User.deleteMany({});

    console.log("Database reset successfully");
}

async function seedDatabase() {
    try {
        await connectDB();
        console.log("Connected to MongoDB Atlas");

        await resetDatabase();

        const userData = [
            {
                name: "John",
                username: "John123",
                email: "john123@gmail.com",
                password: "password123",
                connectCode: "123456",
            },
            {
                name: "User Two",
                username: "user2",
                email: "user2@gmail.com",
                password: "password2",
                connectCode: "654321",
            },
        ];

        const users = [];

        for (const data of userData) {
            const hashedPassword = await bcrypt.hash(data.password, 10);

            const user = await User.create({
                name: data.name,
                username: data.username,
                email: data.email,
                password: hashedPassword,
                connectCode: data.connectCode,
            });

            users.push(user);
        }

        const [user1, user2] = users;

        const conversation = await Conversation.create({
            participants: [user1._id, user2._id],
        });

        await Message.create([
            {
                sender: user1._id,
                conversationId: conversation._id,
                content: "Hey user2!",
            },
            {
                sender: user2._id,
                conversationId: conversation._id,
                content: "Hey John!",
            },
        ]);

        conversation.unreadCounts.set(user1._id.toString(), 1);
        conversation.unreadCounts.set(user2._id.toString(), 0);
        await conversation.save();

        console.log(`Conversation created ${conversation._id}`);

        await Friendship.create({
            requester: user1._id,
            recipient: user2._id,
            status: "accepted",
        });

        console.log("Database seeded successfully");

        await mongoose.disconnect();
        console.log("Database disconnected successfully");

        process.exit(0);
    } catch (error) {
        console.error("The database seeding failed", error);

        await mongoose.disconnect();
        process.exit(1);
    }
}

seedDatabase();