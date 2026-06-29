// // backend/controllers/faceMatchController.js
// import axios from "axios";
// import User from "../models/User.js";
// import Media from "../models/Media.js";

// // 🔥 FIXED: Prevent duplicate requests
// const ongoingRequests = new Map();

// export const runFaceMatch = async (req, res) => {
//   try {
//     const { groupId } = req.body;
//     const userId = req.user.userId;
//     const requestKey = `${userId}-${groupId}`;

//     // Skip if already processing same request
//     if (ongoingRequests.has(requestKey)) {
//       console.log(`⏳ Duplicate request skipped: ${requestKey}`);
//       return res.json({ matchedPhotoUrls: [] });
//     }

//     ongoingRequests.set(requestKey, true);
//     console.log(`🚀 Starting face match: ${requestKey}`);

//     const user = await User.findById(userId);
//     if (!user || !user.selfie) {
//       ongoingRequests.delete(requestKey);
//       return res.status(400).json({ message: "User selfie not found." });
//     }

//     const mediaItems = await Media.find({ group: groupId });
//     if (mediaItems.length === 0) {
//       ongoingRequests.delete(requestKey);
//       return res.json({ matchedPhotoUrls: [] });
//     }

//     const serverBaseUrl = `${req.protocol}://${req.get("host")}`;
//     const userSelfieUrl = `${serverBaseUrl}${user.selfie}`;
//     const groupPhotoUrls = mediaItems.map((item) =>
//       item.filePath.startsWith("http")
//         ? item.filePath
//         : `${serverBaseUrl}${item.filePath}`
//     );

//     console.log(`📸 Processing ${groupPhotoUrls.length} photos for group ${groupId}`);

//     const pythonServiceUrl = "http://127.0.0.1:5001/match-faces";
//     const response = await axios.post(pythonServiceUrl, {
//       userSelfieUrl,
//       groupPhotoUrls,
//     });

//     console.log(`✅ Face match complete: ${response.data.matchedPhotoUrls.length} matches`);
//     res.json(response.data);
//   } catch (error) {
//     console.error("Error in face match controller:", error.message);
//     res.status(500).json({ message: "An error occurred during face matching." });
//   } finally {
//     if (requestKey) ongoingRequests.delete(requestKey);
//   }
// };


import axios from "axios";
import User from "../models/User.js";
import Media from "../models/Media.js";

const ongoingRequests = new Map();

export const runFaceMatch = async (req, res) => {
  let requestKey = null;  
  
  try {
    const { groupId } = req.body;
    const userId = req.user.userId;
    requestKey = `${userId}-${groupId}`;  

    if (ongoingRequests.has(requestKey)) {
      console.log(`⏳ Duplicate request skipped: ${requestKey}`);
      return res.json({ matchedPhotoUrls: [] });
    }

    ongoingRequests.set(requestKey, true);
    console.log(`🚀 Starting face match: ${requestKey}`);

    const user = await User.findById(userId);
    if (!user || !user.selfie) {
      return res.status(400).json({ message: "User selfie not found." });
    }

    const mediaItems = await Media.find({ group: groupId });
    if (mediaItems.length === 0) {
      return res.json({ matchedPhotoUrls: [] });
    }

    const serverBaseUrl = `${req.protocol}://${req.get("host")}`;
    const userSelfieUrl = `${serverBaseUrl}${user.selfie}`;
    const groupPhotoUrls = mediaItems.map((item) =>
      item.filePath.startsWith("http")
        ? item.filePath
        : `${serverBaseUrl}${item.filePath}`
    );

    console.log(`📸 Processing ${groupPhotoUrls.length} photos for group ${groupId}`);

    const pythonServiceUrl = "http://127.0.0.1:5001/match-faces";
    const response = await axios.post(pythonServiceUrl, {
      userSelfieUrl,
      groupPhotoUrls,
    });

    console.log(`✅ Face match complete: ${response.data.matchedPhotoUrls.length} matches`);
    res.json(response.data);
    
  } catch (error) {
    console.error("Error in face match controller:", error.message);
    res.status(500).json({ message: "An error occurred during face matching." });
  } finally {
    if (requestKey && ongoingRequests.has(requestKey)) {
      ongoingRequests.delete(requestKey);
    }
  }
};
