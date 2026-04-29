import mongoose, { connect } from "mongoose";

const userSchema = new mongoose.Schema({
    connectCode: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 30
    },
    username: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 30,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 6
    }
})

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;