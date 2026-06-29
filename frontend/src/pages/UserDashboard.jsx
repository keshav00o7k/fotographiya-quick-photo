// /pages/UserDashboard.jsx
import "./page2.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import JoinGroupModal from "../components/Dashboard/JoinGroupModal";
import GroupCard from "../components/Dashboard/GroupCard";
import Navbar from "../components/Navbar";

const UserDashboard = () => {
  const [groups, setGroups] = useState([]);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/groups/joined", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("👉 joined data:", data);
        // Either:
        setGroups(data.groups); // if backend sends { groups: [...] }
        // Or:
        setGroups(data); // if backend sends directly an array
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <Navbar />
      <div className="page2">
        <div className="back">
          <div className="text">
            <h1>Your Albums</h1>
            <div className="right-text">
              <img
                src="/images/search.png"
                alt="searchlogo"
                className="searchlogo"
              />
              <button
                className="button1"
                onClick={() => setShowJoinModal(true)}
              >
                Join Album
              </button>
            </div>
          </div>

          <div className="group-list">
            {Array.isArray(groups) &&
              groups.map((group) => (
                <GroupCard
                  key={group._id}
                  group={group}
                  onClick={() => navigate(`/group/${group._id}`)}
                />
              ))}
          </div>
        </div>
      </div>

      <JoinGroupModal
        showModal={showJoinModal}
        onClose={() => setShowJoinModal(false)}
      />
    </>
  );
};

export default UserDashboard;
