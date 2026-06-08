import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

async function testConnection() {
  try {
    console.log("Connecting to:", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ SUCCESSFULLY CONNECTED to V1 MongoDB Atlas Cluster!");
    process.exit(0);
  } catch (error) {
    console.error("❌ CONNECTION FAILED:", error.message);
    process.exit(1);
  }
}

testConnection();
