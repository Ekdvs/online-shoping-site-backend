import express from "express";
import { getUserStatistics, sendPromotionalEmail } from "../controllers/adminController.js";

import admin from "../middleweare/admin.js";
import auth from "../middleweare/auth.js";


const adminRouter = express.Router();

//Get Admin Dashboard Stats
adminRouter.get("/stats", auth, admin, getUserStatistics);

//Send Marketing/Promotional Emails
adminRouter.post("/send-promotional", auth, admin, sendPromotionalEmail);

export default adminRouter;
