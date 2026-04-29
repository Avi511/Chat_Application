import express from 'express'; // backend server ready
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import { initializeSocket } from './socket.js';
import http from 'http';
import { connectDB } from './utils/db.js';
import authRoutes from './routes/authRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import { socketAuthMiddleware } from './socket/socketAuthMiddleware.js';
import redisService from "./services/RedisService.js";

dotenv.config();

connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_ORIGIN,
        credentials: true,
        methods: ["GET", "POST"]
    },
    pingTimeout: 60000,
    pingInterval: 25000,
});

app.set("io", io);
io.use(socketAuthMiddleware);

app.use(cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/conversations", messageRoutes);

initializeSocket(io);

redisService.initialize();

try {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
} catch (error) {
    console.error("The server failed to start", error);
    process.exit(1);
}