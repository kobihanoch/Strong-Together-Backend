import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";

// Config-------------------------------------------------------------------
dotenv.config();
const app = express();

// Port
const PORT = process.env.PORT || 5000;

app.use(cookieParser());

// CORS allowance-----------------------------------------------------
const allowedOrigins = [
  process.env.SHILAT_IP,
  process.env.HOME_IP,
  process.env.COMPUTER_IP,
  process.env.PHONE_IP,
  "https://myapp.com", // Production frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
/*app.use(
  cors({
    origin: true,
    credentials: true,
  })
);*/
app.use(express.json());
//connectDB(); // Connect to MongoDB

// Notify the server is running
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Listening to the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// API Routes---------------------------------------------------------------

// Users
app.use("/api/users", userRoutes);

// Auth
app.use("/api/auth", authRoutes);
