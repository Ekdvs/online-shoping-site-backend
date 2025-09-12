import express from "express";
import {
  createPayment,
  updatePayment,
  deletePayment,
  getAllPayments,
  handleStripeWebhook,
  getPaymentReceipt,
  getUserPayments,
} from "../controllers/paymentController.js";
import auth from "../middleweare/auth.js";
import admin from "../middleweare/admin.js";

const paymentRouter = express.Router();

// Normal payment routes
//create payment
paymentRouter.post("/create-intent", auth, createPayment);

//receipt get
paymentRouter.get("/receipt/:id", auth, getPaymentReceipt);

//get all payment
paymentRouter.get("/userpayments", auth, getUserPayments);

//update payment
paymentRouter.put("/:id", auth, updatePayment);

//delete payment
paymentRouter.delete("/:id", auth, deletePayment);

//admin get all payment
paymentRouter.get("/admin/getall", auth, admin, getAllPayments);

// Webhook route (no auth, raw body)
paymentRouter.post("/webhook",
  express.raw({ type: "application/json" }),  
  handleStripeWebhook);

export default paymentRouter;
