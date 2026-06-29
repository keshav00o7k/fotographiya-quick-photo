// config/db.js

import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";

// Use Google DNS to bypass ISP DNS blocking for MongoDB Atlas SRV records
dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config(); // Load the .env file

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);

    // If connected successfully
    console.log(`✅ Connected to MongoDB: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ Problem connecting to MongoDB:", error.message);
  }
};

export default connectDB;
