import express from 'express';
import connectDB from "./configs/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// Import routes
import userRouter from './routers/userRoute.js';
import categoryRouter from './routers/categoryRoute.js';
import subCategoryRouter from './routers/subCategoryRoute.js';
import productRouter from './routers/productRoutes.js';
import cartRouter from './routers/cartRoute.js';
import orderRouter from './routers/orderRoute.js';
import couponRouter from './routers/couponRoutes.js';
import adminRouter from './routers/adminRoutes.js';
import addressRouter from './routers/addressRoute.js';
import ratingRouter from './routers/ratingRoute.js';

dotenv.config();
const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/user", userRouter);
app.use('/api/category', categoryRouter);
app.use('/api/subCategory', subCategoryRouter);
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);
app.use('/api/coupon', couponRouter);
app.use('/api/admin', adminRouter);
app.use('/api/rating', ratingRouter);

// Connect DB but DO NOT start server here
connectDB().then(() => console.log("MongoDB connected"));

export default app; // Export app for serverless
