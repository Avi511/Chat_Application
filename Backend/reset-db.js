import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function resetDatabase() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected successfully.");

        // 1. Delete all messages
        console.log("Deleting all messages...");
        await mongoose.connection.collection('messages').deleteMany({});

        // 2. Delete all conversations (to clear old previews)
        console.log("Deleting all conversations...");
        await mongoose.connection.collection('conversations').deleteMany({});

        // 3. Delete all friendships
        console.log("Deleting all friendships...");
        await mongoose.connection.collection('friendships').deleteMany({});

        // 4. Clear all user public keys
        console.log("Resetting all user public keys...");
        await mongoose.connection.collection('users').updateMany({}, { $set: { publicKey: null } });

        console.log('✅ Database Cleared: All messages deleted and publicKeys reset.');
        process.exit(0);
    } catch (error) {
        console.error("❌ Reset Failed:", error);
        process.exit(1);
    }
}

resetDatabase();
