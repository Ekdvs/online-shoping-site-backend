import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  meta: { type: Object, default: {} },
  role: { type: String, enum: ["user", "admin"], default: "user" } // target role
}, { timestamps: true });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
