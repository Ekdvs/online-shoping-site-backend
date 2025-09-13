import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./configs/db.js";

import userRouter from "./routers/userRoute.js";
import categoryRouter from "./routers/categoryRoute.js";
import subCategoryRouter from "./routers/subCategoryRoute.js";
import productRouter from "./routers/productRoutes.js";
import cartRouter from "./routers/cartRoute.js";
import orderRouter from "./routers/orderRoute.js";
import couponRouter from "./routers/couponRoutes.js";
import adminRouter from "./routers/adminRoutes.js";
import addressRouter from "./routers/addressRoute.js";
import ratingRouter from "./routers/ratingRoute.js";
import paymentRouter from "./routers/paymentRoutes.js";
import { handleStripeWebhook } from "./controllers/paymentController.js";

dotenv.config();
const app = express();

// Middleware
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://online-shopping-site-frontend.vercel.app"],
    credentials: true,
  })
);

// ⚠️ Stripe webhook must come BEFORE express.json()
app.use(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

// JSON parser for all other routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ API routes
app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/subCategory", subCategoryRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/admin", adminRouter);
app.use("/api/reviews", ratingRouter);

// ✅ Non-webhook payment routes
app.use("/api/payments", paymentRouter);

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
