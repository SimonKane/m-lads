import dotenv from 'dotenv';
import mongoose from "mongoose";


dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  db: {
    uri: process.env.DB_URI
  },
};

export async function connectDB() {
  if (!process.env.DB_URI) throw new Error("Missing database connection string");
  await mongoose.connect(process.env.DB_URI, {
    dbName: "hackathon",
  });
  console.log("Connected to MongoDB");
}

export default config;