import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },
    to: { type: mongoose.SchemaTypes.ObjectId, ref: "User", required: true },
    body: { type: String, required: true },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

export default Notification;
