import mongoose from "mongoose";

let cached = global.mongoose; // cache for serverless functions

if (!cached) cached = global.mongoose = { conn: null };

const connectDB = async () => {
  if (!process.env.MONGO_URL) {
    throw new Error(
      "Please define MONGO_URL variable inside the .env file"
    );
  }

  if (cached.conn) {
    console.log("Using cached database connection");
    return cached.conn;
  }

  try {
    const opts = {
      bufferCommands: false,
      // other options if needed
    };

    const conn = await mongoose.connect(process.env.MONGO_URL, opts);
    cached.conn = conn;
    console.log("Successfully connected to database");
    return conn;
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
};

export default connectDB;
