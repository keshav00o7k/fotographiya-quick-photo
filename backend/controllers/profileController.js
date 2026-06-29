import User from "../models/User.js";

// View profile data
export const getProfile = async (req, res) => {
  try {
    // userId comes from JWT
    const user = await User.findById(req.user.userId).select(
      "-password -otp -otpExpiry"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile!" });
  }
};

// Update profile (name, bio, avatar)
export const updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const allowed = ["name", "avatar", "bio"];
    // Only permitted fields get updated
    for (let key of Object.keys(updates)) {
      if (!allowed.includes(key)) {
        return res.status(400).json({ message: "Invalid field!" });
      }
    }
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found!" });

    allowed.forEach((field) => {
      if (updates[field] !== undefined) user[field] = updates[field];
    });
    await user.save();
    res.json({ message: "Profile updated successfully!", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating profile!", error: error.message });
  }
};
