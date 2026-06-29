import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Portfolio from "./pages/portfolio.jsx";
import Register from "./pages/Register";
import Login from "./pages/Login";

import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import VerifyEmailOTP from "./pages/VerifyEmailOTP";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GroupDetail from "./components/Group-details/GroupDetail.jsx";
import Fotographiya_Main from "./pages/Fotographiyamain.jsx";
import SelfieCapture from "./pages/SelfieCapture.jsx";

function App() {
  return (
    <Router>
      <ToastContainer position="top-center" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email-otp" element={<VerifyEmailOTP />} />
        <Route path="/selfie-capture" element={<SelfieCapture />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/profile-setting" element={<Fotographiya_Main />} />
        <Route path="/group/:id" element={<GroupDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
