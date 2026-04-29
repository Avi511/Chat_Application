import jwt from "jsonwebtoken";
import cookie from "cookie";
import User from "../models/User.js";

export const socketAuthMiddleware = async (socket, next) => {
    try {
        const cookieHeader = socket.handshake.headers.cookie;
        if (!cookieHeader) {
            console.log("Socket Auth Failed: No cookie header found");
            return next(new Error("Unauthorized"));
        }
        const parsedCookie = cookie.parse(cookieHeader);
        const token = parsedCookie.token; // The cookie name is 'token', not 'jwt'
        if (!token) {
            console.log("Socket Auth Failed: Token not found in cookies");
            return next(new Error("Unauthorized"));
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            console.log("Socket Auth Failed: User not found in database");
            return next(new Error("User not found"));
        }
        socket.userId = user._id.toString();
        socket.user = user;
        next();
    } catch (error) {
        console.error("Socket auth middleware error:", error);
        return next(new Error("Socket auth middleware error"));
    }
}