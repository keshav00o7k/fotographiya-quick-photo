import Group from "../models/Group.js";
import User from "../models/User.js";
import Media from "../models/Media.js"; // ✅ Add this line at the top
import slugify from "slugify";
const generateGroupCode = async () => {
  let code, exists;
  do {
    code = Math.floor(100000 + Math.random() * 900000).toString();
    exists = await Group.findOne({ code });
  } while (exists);
  return code;
};

// 🟢 Admin creates a group
export const createGroup = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Only admin can create Album!" });
  }

  const { name } = req.body;
  const code = await generateGroupCode();

  // group name se safe folder name
  const folderName = slugify(name, { lower: true, strict: true });
  // e.g. "My Group 1" -> "my-group-1" [web:56][web:58]

  const group = await Group.create({
    name,
    code,
    createdBy: req.user.userId,
    folderName, // 👈 yaha store
  });

  res.status(201).json({ message: "Group has been created!", group });
};
export const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find().populate("createdBy", "email"); // optional
    res.json({ groups });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// 🟢 User joins a group
// groupController.js
export const joinGroup = async (req, res) => {
  try {
    const { code } = req.body;

    const group = await Group.findOne({ code });
    if (!group) {
      return res.status(404).json({ message: "No such group found!" });
    }

    if (group.permittedUsers.includes(req.user.userId)) {
      return res.status(400).json({ message: "You have already joined!" });
    }

    group.permittedUsers.push(req.user.userId);
    await group.save();

    res.json({ message: "Group joined!", groupId: group._id });
  } catch (err) {
    console.error("🔥 Group Join Error:", err);
    res.status(500).json({ message: "Problem while joining group!" });
  }
};

// 🟢 Admin gives full access to a user
export const grantAccess = async (req, res) => {
  const { groupId, userId } = req.body;

  const group = await Group.findById(groupId);
  if (!group) return res.status(404).json({ message: "Group not found!" });

  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Only admin can grant permissions!" });
  }

  if (!group.permittedUsers.includes(userId)) {
    group.permittedUsers.push(userId);
    await group.save();
  }

  res.json({ message: "User has been granted full access!" });
};

export const getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: "Group not found!" });

    const media = await Media.find({ group: group._id });

    res.json({ ...group.toObject(), media });
  } catch (err) {
    console.error("Group fetch error:", err);
    res.status(500).json({ message: "Unable to load group!" });
  }
};
// groupController.js
export const getJoinedGroups = async (req, res) => {
  try {
    const groups = await Group.find({
      permittedUsers: req.user.userId,
    });
    res.json(groups);
  } catch (err) {
    console.error("❌ Fetch joined groups failed:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// 🟢 Admin updates group settings (name, cover image, watermark, etc.)
export const updateGroupThumbnail = async (req, res) => {
  try {
    const groupId = req.params.groupId || req.params.id;
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found!" });

    if (req.user.role !== "admin" && group.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Only admin can update group settings!" });
    }

    const { name, coverPosition, watermarkType, watermarkText, watermarkX, watermarkY, watermarkSize } = req.body;

    if (name && name.trim()) {
      group.name = name.trim();
    }

    if (coverPosition) {
      group.coverPosition = coverPosition;
    }

    if (watermarkType !== undefined) group.watermarkType = watermarkType;
    if (watermarkText !== undefined) group.watermarkText = watermarkText;
    if (watermarkX !== undefined) group.watermarkX = Number(watermarkX);
    if (watermarkY !== undefined) group.watermarkY = Number(watermarkY);
    if (watermarkSize !== undefined) group.watermarkSize = Number(watermarkSize);

    const folderName = group.folderName || group._id.toString();

    // Handle single file upload or multiple fields upload
    if (req.file) {
      const thumbnailPath = `/groups/${folderName}/${req.file.filename}`;
      group.thumbnail = thumbnailPath;
    } else if (req.files) {
      if (req.files.thumbnail && req.files.thumbnail[0]) {
        group.thumbnail = `/groups/${folderName}/${req.files.thumbnail[0].filename}`;
      }
      if (req.files.watermarkLogo && req.files.watermarkLogo[0]) {
        group.watermarkLogo = `/groups/${folderName}/${req.files.watermarkLogo[0].filename}`;
      }
    }

    await group.save();

    res.json({ 
      message: "Group settings updated successfully!", 
      thumbnail: group.thumbnail, 
      group 
    });
  } catch (err) {
    console.error("❌ Update group settings error:", err);
    res.status(500).json({ message: "Failed to update group settings!" });
  }
};
