import "./page2.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CreateGroupModal from "../components/Dashboard/CreateGroupModal";
import JoinGroupModal from "../components/Dashboard/JoinGroupModal";
import GroupCard from "../components/Dashboard/GroupCard";
import Navbar from "../components/Navbar";
import { BACKEND_URL } from "../config";

const Page2 = () => {
  const [showModal, setShowModal] = useState(false);
  const [groups, setGroups] = useState([]);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/groups/all`)
      .then((res) => res.json())
      .then((data) => setGroups(data))
      .catch((err) => console.error(err));
  }, []);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleJoinClick = () => {
    setShowJoinModal(true);
  };

  const handleGroupCreated = (newGroup) => {
    setGroups((prev) => [...prev, newGroup]);
  };

  return (
    <>
      <Navbar />
      <div className="page2">
        <div className="back">
          <div className="text">
            <h1>Album</h1>
            <div className="right-text">
              {/* <img
                src="/images/search.png"
                alt="searchlogo"
                className="searchlogo"
              /> */}
              <button className="button1" onClick={handleJoinClick}>
                Join Album
              </button>
              <button className="button2" onClick={handleOpenModal}>
                Create Album
              </button>
            </div>
          </div>

          <div className="group-list">
            {groups.map((group) => (
              <GroupCard
                key={group._id}
                group={group}
                onClick={() => navigate(`/group/${group._id}`)}
              />
            ))}
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

export default Page2;
