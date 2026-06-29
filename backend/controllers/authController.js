// backend/controllers/authController.js

import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendMail } from "../utils/sendMail.js";

// 📌 Register user: OTP will be sent, cannot login until verified
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, avatar, bio, selfie } = req.body;

    // Is user already present?
    const existing = await User.findOne({ email });
    if (existing)
      return res
        .status(400)
        .json({ message: "This email is already registered." });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // Valid for 10 minutes

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      selfie,
      isVerified: false,
      verifyOTP: otp,
      otpExpiry: expiry,
    });

    // Send OTP Email
    await sendMail(
      email,
      "Email Verification OTP",
      `Your OTP is: ${otp}`,
      `<h3>Hi ${name}!</h3><p>Your email verification code is: <b>${otp}</b></p>`
    );

    res.status(201).json({
      message: "Registration successful! OTP has been sent to your email.",
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res
      .status(500)
      .json({ message: "Error during registration!", error: error.message });
  }
};

// 📌 Verify Email OTP
export const verifyEmailOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found!" });

    if (user.isVerified)
      return res.status(400).json({ message: "Email is already verified." });

    if (
      user.verifyOTP !== otp ||
      !user.otpExpiry ||
      user.otpExpiry < new Date()
    )
      return res.status(400).json({ message: "OTP is incorrect or expired!" });

    user.isVerified = true;
    user.verifyOTP = undefined;
    user.otpExpiry = undefined;
    await user.save();

    const role = email === process.env.ADMIN_EMAIL ? "admin" : "user";
    const token = jwt.sign({ userId: user._id, role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Email has been verified!",
      token,
      role,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while verifying OTP!", error: error.message });
  }
};

// 📌 Login - Allow only verified users
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found!" });

    if (!user.isVerified)
      return res
        .status(403)
        .json({ message: "Please verify your email first." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Incorrect password!" });

    const role = email === process.env.ADMIN_EMAIL ? "admin" : "user";

    // Create JWT Token
    const token = jwt.sign({ userId: user._id, role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login successful!",
      token,
      role, // 👈 Pass role back
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        selfie: user.selfie,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error during login!", error: error.message });
  }
};

// 📌 Send OTP for password reset
export const sendResetOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Email is not registered!" });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    user.verifyOTP = otp;
    user.otpExpiry = expiry;
    await user.save();

    await sendMail(
      email,
      "Password Reset OTP",
      `Your OTP is: ${otp}`,
      `<h3>Your OTP is: <b>${otp}</b></h3><p>Valid for 10 minutes</p>`
    );

    res.json({ message: "OTP has been sent!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending OTP!", error: error.message });
  }
};

// 📌 Reset password with OTP
export const resetPasswordWithOTP = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.verifyOTP !== otp)
      return res.status(400).json({ message: "OTP is incorrect or expired!" });

    if (!user.otpExpiry || new Date() > user.otpExpiry)
      return res.status(400).json({ message: "OTP validity has expired!" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.verifyOTP = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.json({ message: "Password has been changed successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error changing password!", error: error.message });
  }
};
// backend/controllers/authController.js -> uploadSelfie

export const uploadSelfie = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Selfie file is required" });
    }

    const userId = req.user.userId;
    // const selfiePath = `/uploads/selfies/${req.file.filename}`;
    // const selfiePath = `Z:/quick_foto_Testing/Selfie/${req.file.filename}`;
    const selfiePath = `/Selfie/${req.file.filename}`;

    // Find the user, update, and get the new document
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { selfie: selfiePath },
      { new: true } // 👈 This option returns the updated document
    ).select("-password -verifyOTP -otpExpiry"); // Exclude sensitive fields

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Selfie uploaded successfully",
      user: updatedUser, // 👈 Send the full updated user object
    });
  } catch (error) {
    console.error("Selfie Upload Error:", error);
    res.status(500).json({ message: "Failed to upload selfie" });
  }
};
