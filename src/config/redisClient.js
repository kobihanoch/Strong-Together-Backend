// redisClient.js
import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

export const redis = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

redis.on("error", (err) => console.log("Redis Client Error", err));

export const connectRedis = async () => {
  await redis.connect();
  await redis.set("Req", "Valid connection");
  const result = await redis.get("Req");
  console.log("✅ Redis Connected!", result);
};
