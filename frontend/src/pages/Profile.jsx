// src/pages/Profile.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // For redirect on logout
import api from "../utils/axiosConfig"; // axios instance

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedData, setUpdatedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Logout button functionality: remove token/user info and redirect to login
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Fetch user profile once (on mount)
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/profile");
        setProfile(res.data);
        setUpdatedData({
          name: res.data.name || "",
          bio: res.data.bio || "",
          avatar: res.data.avatar || "",
        });
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching profile!");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Handle input changes (for edit mode)
  const handleChange = (e) => {
    setUpdatedData({ ...updatedData, [e.target.name]: e.target.value });
  };

  // Update Profile (PUT API call)
  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");
    try {
      const res = await api.put("/profile", updatedData);
      setProfile(res.data.user);
      setMsg("Profile updated successfully!");
      setEditMode(false);
    } catch (err) {
      setError(
        err.response?.data?.message || "Problem updating profile!"
      );
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={styles.container}>
      <h2>👤 My Profile</h2>
      <img
        src={profile.avatar || "https://i.ibb.co/2tK0wFW/user.png"}
        alt="Avatar"
        style={styles.avatar}
      />
      {!editMode ? (
        <>
          <p>
            <b>Name:</b> {profile.name}
          </p>
          <p>
            <b>Email:</b> {profile.email}
          </p>
          <p>
            <b>Bio:</b> {profile.bio || "-"}
          </p>
          <button style={styles.button} onClick={() => setEditMode(true)}>
            Edit Profile
          </button>
        </>
      ) : (
        <form onSubmit={handleSave} style={styles.form}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={updatedData.name}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="text"
            name="bio"
            placeholder="Biography"
            value={updatedData.bio}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="text"
            name="avatar"
            placeholder="Avatar image URL"
            value={updatedData.avatar}
            onChange={handleChange}
            style={styles.input}
          />
          <button style={styles.button} type="submit">
            Save
          </button>
          <button
            type="button"
            style={{ ...styles.button, background: "#adadad" }}
            onClick={() => setEditMode(false)}
          >
            Cancel
          </button>
        </form>
      )}
      {msg && <p style={styles.success}>{msg}</p>}
      {/* Logout button */}
      <button
        onClick={handleLogout}
        style={{
          marginTop: "18px",
          background: "#ff7675",
          color: "#fff",
          border: "none",
          padding: "10px",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
};

// Basic inline CSS
const styles = {
  container: {
    maxWidth: "400px",
    margin: "40px auto",
    padding: "25px",
    border: "1px solid #dedede",
    borderRadius: "8px",
    background: "#fbfbfb",
    textAlign: "center",
  },
  avatar: {
    width: "85px",
    height: "85px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "12px",
    border: "2px solid #eee",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "10px",
  },
  button: {
    fontWeight: "bold",
    background: "#00b894",
    color: "#fff",
    border: "none",
    padding: "10px",
    margin: "6px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  input: {
    padding: "9px",
    fontSize: "1em",
    border: "1px solid #bbb",
    borderRadius: "3px",
  },
  success: {
    color: "green",
    marginTop: "12px",
  },
};

export default Profile;
