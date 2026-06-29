// /pages/AdminDashboard.jsx
import "./page2.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CreateGroupModal from "../components/Dashboard/CreateGroupModal";
import JoinGroupModal from "../components/Dashboard/JoinGroupModal";
import GroupCard from "../components/Dashboard/GroupCard";
import Navbar from "../components/Navbar";

const AdminDashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [groups, setGroups] = useState([]); // ✅ Always an array
  const [showJoinModal, setShowJoinModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:5000/api/groups/all", {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Send token
          },
        });

        const data = await res.json();
        console.log("✅ Groups fetched:", data);

        // ✅ Make sure data.groups is an array
        setGroups(Array.isArray(data.groups) ? data.groups : []);
      } catch (err) {
        console.error("❌ Error fetching groups:", err);
        setGroups([]); // fallback empty
      }
    };

    fetchGroups();
  }, []);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleJoinClick = () => setShowJoinModal(true);

  const handleGroupCreated = (newGroupData) => {
    const newGroup = newGroupData.group || newGroupData; // Support both formats
    setGroups((prev) => [...prev, newGroup]);
  };

  return (
    <>
      <Navbar />
      <div className="page2">
        <div className="back">
          <div className="text">
            <h1>Albums</h1>
            <div className="right-text">
              <img
                src="/images/search.png"
                alt="searchlogo"
                className="searchlogo"
              />
              <button className="button1" onClick={handleJoinClick}>
                Join Album
              </button>
              <button className="button2" onClick={handleOpenModal}>
                Create Album
              </button>
            </div>
          </div>

          <div className="group-list">
            {Array.isArray(groups) && groups.length > 0 ? (
              groups.map((group) => (
                <GroupCard
                  key={group._id}
                  group={group}
                  onClick={() => navigate(`/group/${group._id}`)}
                />
              ))
            ) : (
              <p
                style={{
                  color: "#555",
                  textAlign: "center",
                  marginTop: "2rem",
                }}
              >
                No groups found or there is a problem loading.
              </p>
            )}
          </div>
        </div>
      </div>

      <CreateGroupModal
        showModal={showModal}
        onClose={handleCloseModal}
        onGroupCreated={handleGroupCreated}
      />

      <JoinGroupModal
        showModal={showJoinModal}
        onClose={() => setShowJoinModal(false)}
      />
    </>
  );
};

export default AdminDashboard;
