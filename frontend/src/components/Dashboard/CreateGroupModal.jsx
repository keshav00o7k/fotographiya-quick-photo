import { useState } from "react";
import { toast } from "react-toastify"; // ✅ Toast import
// import "./CreateGroupModal.css";
import { BACKEND_URL } from "../../config";

const CreateGroupModal = ({ showModal, onClose, onGroupCreated }) => {
  const [step, setStep] = useState(1);
  const [groupName, setGroupName] = useState("");
  const [selectedPrivacy, setSelectedPrivacy] = useState("personal");

  const handleCloseModal = () => {
    onClose();
    setGroupName("");
    setStep(1);
  };

  const handleNext = () => {
    if (groupName.trim() === "") return toast.warn("Please enter group name");
    setStep(2);
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BACKEND_URL}/api/groups/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: groupName, privacy: selectedPrivacy }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`✅ Group Created! Code: ${data.group.code}`, {
          position: "top-center",
          autoClose: 4000,
        });

        onGroupCreated(data.group);
        handleCloseModal();
      } else {
        toast.error(data.message || "Group creation failed!", {
          position: "top-center",
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("⚠️ Server error while creating group", {
        position: "top-center",
      });
    }
  };

  if (!showModal) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="close-btn" onClick={handleCloseModal}>
          &times;
        </span>

        {step === 1 ? (
          <>
            <h2>Group Name</h2>
            <input
              type="text"
              placeholder="Enter Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
            <button className="next-btn" onClick={handleNext}>
              Next
            </button>
            <p>Step 1 of 2</p>
          </>
        ) : (
          <>
            <h2>Select Privacy Settings</h2>
            <div className="privacy-option-container">
              <div
                className={`privacy-option ${
                  selectedPrivacy === "personal" ? "selected" : ""
                }`}
                onClick={() => setSelectedPrivacy("personal")}
              >
                <h4>Small Personal Group</h4>
                <p>✅ Face recognition</p>
                <p>✅ View all other photos and folders</p>
              </div>

              <div
                className={`privacy-option ${
                  selectedPrivacy === "public" ? "selected" : ""
                }`}
                onClick={() => setSelectedPrivacy("public")}
              >
                <h4>Big Public Group</h4>
                <p>✅ Face recognition</p>
                <p>⚠️ Admin can choose members who have all photos access</p>
              </div>
            </div>

            <button className="next-btn" onClick={handleCreateGroup}>
              Create Group
            </button>
            <p>Step 2 of 2</p>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateGroupModal;
