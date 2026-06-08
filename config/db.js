import mongoose from "mongoose";

let cached = global._mongooseCache;
if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

const connectDB = async () => {
  // If already connected, return immediately
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // If a connection attempt is already in progress, wait for it
  if (cached.promise) {
    try {
      cached.conn = await cached.promise;
      return cached.conn;
    } catch (error) {
      cached.promise = null; // Reset so next call retries
      console.error("❌ MongoDB connection failed (cached):", error.message);
      return null;
    }
  }

  try {
    cached.promise = mongoose.connect(process.env.MONGO_URI, {
      autoIndex: true,
      serverSelectionTimeoutMS: 10000, // 10s timeout instead of 30s default
      socketTimeoutMS: 45000,
    });

    cached.conn = await cached.promise;
    console.log("✅ MongoDB connected");
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error("❌ MongoDB connection failed:", error.message);
    // DO NOT process.exit(1) — let the server stay alive and retry next request
    return null;
  }
};

export default connectDB;
