import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import { connectDB } from "./config/db.js";
import { connectRedis } from "./config/redisClient.js";
import { createIOServer, startSocket } from "./config/webSocket.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { generalLimiter } from "./middlewares/rateLimiter.js";
import aerobicsRoutes from "./routes/aerobicsRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import bootsrapRoutes from "./routes/bootstrapRoutes.js";
import exercisesRoutes from "./routes/exercisesRoutes.js";
import messagesRoutes from "./routes/messagesRoutes.js";
import pushRoutes from "./routes/pushRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import workoutRoutes from "./routes/workoutRoutes.js";

// RESOURECES CONNECTIONS AND GENERAL CONFIGURATIONS  ------------------------------------------
dotenv.config();

// Create an express servernpm
const app = express();

// Define port
const PORT = process.env.PORT || 5000;

await connectDB(); // Connect to MongoDB
await connectRedis(); // Connect to Redis

// MIDDLWARES ----------------------------------------------------------------------------------

// Use express JSON formats
app.use(express.json());

// Use helmet
app.use(helmet());

// Trust proxy to get the request device IP for rate limiting
// IMPORTANT: Allow it only if using secured cloud services like Render, AWS, Azure, etc...
app.set("trust proxy", 1);

// Use general rate limiter
app.use(generalLimiter);

// Notify the server is running
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Health check
app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));

// API ROUTES --------------------------------------------------------------------------------------------------

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

// Users
app.use("/api/users", userRoutes);

// Auth
app.use("/api/auth", authRoutes);

// Workouts
app.use("/api/workouts", workoutRoutes);

// Messages
app.use("/api/messages", messagesRoutes);

// Exercises
app.use("/api/exercises", exercisesRoutes);

// Analytics
app.use("/api/analytics", analyticsRoutes);

// Aerobics
app.use("/api/aerobics", aerobicsRoutes);

// Push notifications
app.use("/api/push", pushRoutes);

// Bootstrap
app.use("/api/bootstrap", bootsrapRoutes);

// Error Handler
app.use(errorHandler);

// SOCKET CONNECTIONS ---------------------------------------------------------------------------------------------
const { io, server } = createIOServer(app);
await startSocket(io);

// LISTEN TO PORT ------------------------------------------------------------------------------------------------
server.listen(PORT, () => {
  console.log(`Websocket is running on port ${PORT}`);
  console.log(`Server is running on port ${PORT}`);
});
