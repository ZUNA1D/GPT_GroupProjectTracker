import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    profilePicture: { type: String },
    isEmailVerified: { type: Boolean, default: false },
    password: { type: String, required: true, select: false },
    lastLogin: { type: Date },
    is2FAEnabled: { type: Boolean, default: false },
    twoFAOTP: { type: String, select: false },
    twoFAOTPExpires: { type: Date, select: false }
}, 
    {timestamps: true}
);


const User = mongoose.model('User', userSchema);

export default User;