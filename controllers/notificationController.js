import Notification from "../models/notification.model.js";
import UserModel from "../models/user.model.js";
import { emitToUser, emitToAdmin } from "../services/soketService.js";

// ------------------ USER NOTIFICATIONS ------------------

// Get notifications for logged-in user
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.userId })
      .sort({ createdAt: -1 });

    res.json({ success: true, data: notifications });
  } catch (err) {
    console.error("Get user notifications error:", err);
    res.status(500).json({ success: false, message: "Error fetching notifications" });
  }
};

// Mark a notification as read
export const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );
    if (!note) return res.status(404).json({ success: false, message: "Notification not found" });

    res.json({ success: true, data: note });
  } catch (err) {
    console.error("Mark notification read error:", err);
    res.status(500).json({ success: false, message: "Failed to mark as read" });
  }
};

// Delete a notification
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Notification.findByIdAndDelete(id);
    if (!note) return res.status(404).json({ success: false, message: "Notification not found" });

    res.json({ success: true, message: "Notification deleted" });
  } catch (err) {
    console.error("Delete notification error:", err);
    res.status(500).json({ success: false, message: "Failed to delete notification" });
  }
};

// ------------------ ADMIN NOTIFICATIONS ------------------

// Get all notifications for admins
export const getAdminNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ role: "admin" }).sort({ createdAt: -1 });
    res.json({ success: true, data: notifications });
  } catch (err) {
    console.error("Get admin notifications error:", err);
    res.status(500).json({ success: false, message: "Error fetching admin notifications" });
  }
};

// Create an admin notification (broadcast to all admins)
export const createNotification = async (req, res) => {
  try {
    const { message, meta } = req.body;
    if (!message) return res.status(400).json({ success: false, message: "Message is required" });

    // Find all admins
    const admins = await UserModel.find({ role: "ADMIN" }, "_id");
    const createdNotes = [];

    for (const admin of admins) {
      const note = await Notification.create({
        userId: admin._id,
        message,
        meta: meta || {},
        role: "admin",
      });

      // Emit notification to admin in real-time
      emitToUser(admin._id, "newAdminNotification", note);
      createdNotes.push(note);
    }

    res.status(201).json({ success: true, data: createdNotes });
  } catch (err) {
    console.error("Create admin notification error:", err);
    res.status(500).json({ success: false, message: "Failed to create notification" });
  }
};
