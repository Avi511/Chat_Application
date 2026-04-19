import User from "../models/user.js";
import bcrypt from "bcrypt";

class AuthController {
    static async register(req, res) {
        try {
            const { name, username, email, password } = req.body;
            if (!name || !username || !email || !password) {
                return res.status(400).json({ message: "All fields are required" });
            }
            if (password.length < 6) {
                return res.status(400).json({ message: "Password must be at least 6 characters long" });
            }
            const existingUser = await User.findOne({ $or: [{ email }, { username }] });
            if (existingUser) {
                return res.status(400).json({ message: "User already exists" });
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const user = new User({
                name,
                username,
                email,
                password: hashedPassword,
                connectCode: generateConnectCode()
            });

            await user.save();
            res.status(201).json({ message: "User registered successfully", user });

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Registration error" });
        }
    }
}

export default new AuthController();