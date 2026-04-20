import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import generateUniqueConnectCode from "../utils/generateUniqueConnectCode.js";

class AuthController {
    static async register(req, res) {
        try {
            let { name, username, email, password } = req.body;

            name = name?.trim();
            username = username?.trim();
            email = email?.trim().toLowerCase();
            password = password?.trim();

            if (!name || !username || !email || !password) {
                return res.status(400).json({ message: "All fields are required" });
            }

            if (password.length < 6) {
                return res.status(400).json({ message: "Password must be at least 6 characters long" });
            }

            const existingUser = await User.findOne({
                $or: [{ email }, { username }]
            });

            if (existingUser) {
                return res.status(400).json({ message: "Email or username already in use" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const connectCode = await generateUniqueConnectCode();

            const user = await User.create({
                name,
                username,
                email,
                password: hashedPassword,
                connectCode
            });

            return res.status(201).json({
                message: "User registered successfully",
                user: {
                    id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    connectCode: user.connectCode
                }
            });
        } catch (error) {
            console.error("Register error:", error);
            return res.status(500).json({ message: "Registration error" });
        }
    }

    static async login(req, res) {
        try {
            let { identifier, password } = req.body;

            identifier = identifier?.trim();
            password = password?.trim();

            if (!identifier || !password) {
                return res.status(400).json({ message: "All fields are required" });
            }

            const user = await User.findOne({
                $or: [{ email: identifier.toLowerCase() }, { username: identifier }]
            });

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

            res.cookie("token", token, {
                httpOnly: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
                secure: process.env.NODE_ENV === "production"
            });

            return res.status(200).json({
                message: "User logged in successfully",
                user: {
                    id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    connectCode: user.connectCode,
                    token
                }
            });
        } catch (error) {
            console.error("Login error:", error);
            return res.status(500).json({ message: "Login error" });
        }
    }

    static async getMe(req, res) {
        try {
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.status(200).json({
                message: "User found successfully",
                user: {
                    id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    connectCode: user.connectCode
                }
            });
        } catch (error) {
            console.error("Get me error:", error);
            return res.status(500).json({ message: "Get me error" });
        }
    }

    static async logout(req, res) {
        try {
            return res.status(200).json({ message: "Logout successfully" });
        } catch (error) {
            console.error("Logout error:", error);
            return res.status(500).json({ message: "Logout error" });
        }
    }
}

export default AuthController;