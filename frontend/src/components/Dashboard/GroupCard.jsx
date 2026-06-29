import { useEffect, useState } from "react";
import api from "../../utils/axiosConfig";

const GroupCard = ({ group, onClick }) => {
  const [photoCount, setPhotoCount] = useState(0);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const res = await api.get(`/groups/${group._id}`);
        setPhotoCount(res.data.media?.length || 0);
      } catch (err) {
        console.error("Failed to fetch group detail", err);
      }
    };

    fetchGroupDetails();
  }, [group._id]);

  // Get thumbnail: use group's thumbnail if exists, otherwise default icon
  const getThumbnail = () => {
    if (group.thumbnail) {
      return group.thumbnail.startsWith("http") 
        ? group.thumbnail 
        : `http://localhost:5000${group.thumbnail}`;
    }
    return "/images/group-icon.png";
  };

  return (
    <div className="group-card" onClick={onClick}>
      <div className="group-thumbnail">
        <img
          src={getThumbnail()}
          alt={group.name}
          style={{ objectPosition: group.coverPosition || "50% 50%" }}
          onError={(e) => {
            e.target.src = "/images/group-icon.png"; // Fallback if image fails to load
          }}
        />
      </div>

      <div className="group-info">
        <span className="group-title">
          {group.name}
          {group.privacy === "personal" && (
            <span className="lock-icon">🔒</span>
          )}
        </span>

        <span className="group-photos-count">{photoCount} Photos</span>
      </div>
    </div>
  );
};

export default GroupCard;
