import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/User.js"
import cloudinary, { getSignedUrl } from "../utils/cloudinary.js"



class AuthController {
    static async register(req, res) {
        try {
            const { fullName, username, email, mobileNumber, password } = req.body;

            if (!fullName || !username || !email || !mobileNumber || !password) {
                return res.status(400).json({ message: "All fields are required" });
            }

            if (password.length < 6) {
                return res.status(400).json({ message: "Password must be at lesat 6 characters long" });
            }

            const existingUser = await User.findOne({
                $or: [{ username }, { email }, { mobileNumber }]
            });

            if (existingUser) {
                return res.status(400).json({ message: "User already exists with username, email, or mobile number" });
            }

            // hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            let profilePictureUrl = "/profileicon.jpg";
            let profilePicturePublicId = "";
            if (req.file) {
                const fileBase64 = req.file.buffer.toString("base64");
                const fileUri = `data:${req.file.mimetype};base64,${fileBase64}`;
                
                const uploadResponse = await cloudinary.uploader.upload(fileUri, {
                    folder: "profile_pictures",
                    type: "private"
                });
                profilePictureUrl = uploadResponse.secure_url;
                profilePicturePublicId = uploadResponse.public_id;
            }

            const user = new User({
                username,
                fullName,
                email,
                mobileNumber,
                password: hashedPassword,
                profilePicture: profilePictureUrl,
                profilePicturePublicId: profilePicturePublicId
            });

            await user.save();

            res.status(201).json({ success: true });


        } catch (error) {
            console.error("Registration error", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            const user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
                expiresIn: '7d'
            })

            res.cookie("jwt", token, {
                maxAge: 7 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: 'strict',
                secure: process.env.NODE_ENV !== "development"
            })

            res.status(200).json({
                user: {
                    id: user.id,
                    username: user.username,
                    fullName: user.fullName,
                    email: user.email,
                    mobileNumber: user.mobileNumber,
                    profilePicture: user.profilePicturePublicId ? getSignedUrl(user.profilePicturePublicId) : user.profilePicture
                }
            })


        } catch (error) {
            console.error("Login error", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static async me(req, res) {
        try {
            const user = await User.findById(req.user.id).select("-password");

            if (!user) {
                return res.status(400).json({ message: "User not found" });
            }

            res.status(200).json({
                user: {
                    id: user.id,
                    username: user.username,
                    fullName: user.fullName,
                    email: user.email,
                    mobileNumber: user.mobileNumber,
                    profilePicture: user.profilePicturePublicId ? getSignedUrl(user.profilePicturePublicId) : user.profilePicture
                }
            })

        } catch (error) {
            console.error("Me error", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static async logout(req, res) {
        res.cookie("jwt", "", { maxAge: 0 });
        res.cookie("token", "", { maxAge: 0 });
        res.json({ message: "Logged out successfully!" });
    }

    static async updateProfile(req, res) {
        try {
            const { fullName, username } = req.body;
            const userId = req.user._id;

            if (!fullName && !username) {
                return res.status(400).json({ message: "No data provided for update" });
            }

            const updateData = {};
            if (fullName) updateData.fullName = fullName;
            if (username) {
                const existingUser = await User.findOne({ username, _id: { $ne: userId } });
                if (existingUser) {
                    return res.status(400).json({ message: "Username already taken" });
                }
                updateData.username = username;
            }

            const user = await User.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");

            res.status(200).json({
                message: "Profile updated successfully",
                user: {
                    id: user.id,
                    username: user.username,
                    fullName: user.fullName,
                    email: user.email,
                    mobileNumber: user.mobileNumber,
                    profilePicture: user.profilePicturePublicId ? getSignedUrl(user.profilePicturePublicId) : user.profilePicture
                }
            });

        } catch (error) {
            console.error("Update profile error", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

export default AuthController;