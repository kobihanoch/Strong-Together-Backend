import mongoose from "mongoose";

// Pilates group session model
const sessionSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    time: { type: String, required: true }, // e.g., "20:00"
    duration: { type: Number, required: true }, // in minutes
    type: { type: String, required: true }, // e.g., "reformer", "mat", etc.
    notes: { type: String },
    status: {
      type: String,
      enum: ["מתוכנן", "בוטל", "הושלם"],
      default: "מתוכנן",
    },
    location: {
      type: String,
      default: "סטודיו",
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    maxParticipants: {
      type: Number,
      default: 10,
    },
  },
  { timestamps: true }
);

const Session =
  mongoose.models.Session || mongoose.model("Session", sessionSchema);

export default Session;
