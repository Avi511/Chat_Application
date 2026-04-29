import mongoose, { connect } from "mongoose";

const userSchema = new mongoose.Schema({
    mobileNumber: {
        type: String,
        required: true,
        unique: true,
        index: true,
        match: [/^\d{10,15}$/, 'Please enter a valid mobile number']
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