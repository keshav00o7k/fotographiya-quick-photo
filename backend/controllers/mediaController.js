import Media from "../models/Media.js";
import Group from "../models/Group.js";

// controllers/mediaController.js
export const uploadMedia = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found!" });

    console.log("📸 File received:", req.file);

    const serverBaseUrl = `${req.protocol}://${req.get("host")}`;

    const folderName = group.folderName || group._id.toString();

    // URL jo client ko milega:
    const relativePath = `/groups/${folderName}/${req.file.filename}`;

    const media = await Media.create({
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      filePath: serverBaseUrl + relativePath,
      fileSize: req.file.size,
      group: groupId,
      uploadedBy: req.user.userId,
    });

    res.status(201).json({ message: "Media uploaded successfully!", media });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ message: "Error uploading media!" });
  }
};

// Fetch media for a group based on access
export const getGroupMedia = async (req, res) => {
  const { groupId } = req.params;

  const group = await Group.findById(groupId);
  if (!group) return res.status(404).json({ message: "Group not found!" });

  let media;
  if (
    req.user.userId === String(group.createdBy) ||
    group.permittedUsers.includes(req.user.userId)
  ) {
    // Admin or permitted users get all
    media = await Media.find({ group: groupId });
  } else {
    // Only user's own uploads
    media = await Media.find({ group: groupId, uploadedBy: req.user.userId });
  }

  res.json(media);
};
