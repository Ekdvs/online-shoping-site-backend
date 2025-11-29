import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./configs/db.js";
import http from "http";
import { Server as IOServer } from "socket.io";
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
import notificationRouter from "./routers/notificationRoutes.js";
import { initSocket } from "./services/soketService.js";

dotenv.config();
const app = express();

// ⚠️ Stripe webhook must come BEFORE express.json()
app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

// Middleware
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", process.env.FRONTEND_URL,process.env.PREVIEW_URL],
    credentials: true,
  })
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
app.use("/api/notifications",notificationRouter);


//socket .io
const httpServer = http.createServer(app);

const io = new IOServer(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "https://online-shopping-site-frontend.vercel.app"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
  },
});

// socket auth
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("Authentication error: token required"));

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
    socket.user = { id: decoded.id, role: decoded.role };
    next();
  } catch {
    next(new Error("Authentication error"));
  }
});

// Socket connection
io.on("connection", (socket) => {
  const { id, role } = socket.user;

  socket.join(`user_${id}`);
  if (role === "ADMIN") socket.join("admins");

  socket.on("disconnect", (reason) => console.log(`❌ Socket ${socket.id} disconnected: ${reason}`));
});

initSocket(io);

connectDB().then(() => {
  httpServer.listen(process.env.PORT || 5000, () =>
    console.log("🚀 Server running on port", process.env.PORT || 5000)
  );

});

