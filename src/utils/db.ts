import mongoose from "mongoose";
import Redis from "ioredis"
import dotenv from "dotenv";
dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("MongoDB connected");
  } catch (err) {
    console.log(err);
  }
};

const REDIS_URL = `rediss://default:${process.env.REDIS_UPSTASH_PASSWORD}@working-peacock-41655.upstash.io:6379`

export const redisClient = new Redis(REDIS_URL);

export const connectRedis = async () => { };