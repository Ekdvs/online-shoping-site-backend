import express from "express";
import {
  createNotification,
  deleteNotification,
  getNotifications,
  markNotificationRead,
  getAdminNotifications
} from "../controllers/notificationController.js";
import auth from "../middleweare/auth.js";
import admin from "../middleweare/admin.js";

const router = express.Router();

// USER routes
router.get("/", auth, getNotifications);
router.patch("/:id/read", auth, markNotificationRead);
router.delete("/:id", auth, deleteNotification);

// ADMIN routes
router.get("/admin", auth, admin, getAdminNotifications);
router.post("/", auth, admin, createNotification);

export default router;
