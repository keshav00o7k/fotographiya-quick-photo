import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    selfie: { type: String },
    bio: { type: String },
    // 🔽 Email verification fields
    isVerified: { type: Boolean, default: false }, // क्या ईमेल verify है?
    verifyOTP: { type: String }, // Verification OTP
    otpExpiry: { type: Date }, // OTP Expiry
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
