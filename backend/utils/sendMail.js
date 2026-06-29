// utils/sendMail.js

import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Nodemailer transporter for Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Function to send mail
export const sendMail = async (to, subject, text, html) => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      text,
      html,
    });
  } catch (error) {
    console.log("Error sending mail:", error.message);
    throw new Error("Email could not be sent.");
  }
};
