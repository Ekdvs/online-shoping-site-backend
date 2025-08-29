import express from 'express'
import connectDB from "./configs/db.js";
import dotenv from "dotenv";
import userRouter from './routers/userRoute.js';
import cookieParser from "cookie-parser";
import categoryRouter from './routers/categoryRoute.js';
import subCategoryRouter from './routers/subCategoryRoute.js';
import productRouter from './routers/productRoutes.js';
import cartRouter from './routers/cartRoute.js';
import orderRouter from './routers/orderRoute.js';
import couponRouter from './routers/couponRoutes.js';
import adminRouter from './routers/adminRoutes.js';
import addressRouter from './routers/addressRoute.js';


const app= express();
dotenv.config();
app.use(cookieParser());

// Middleware
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); //

//Routes
app.use("/api/user",userRouter);
app.use('/api/category',categoryRouter)
app.use('/api/subCategory',subCategoryRouter)
app.use('/api/products',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/address',addressRouter)
app.use('/api/order',orderRouter)
app.use('/api/coupon',couponRouter)
app.use('/api/admin',adminRouter)

const Port=process.env.PORT||5000;

connectDB().then(()=>{
    app.listen(Port,()=>{
    console.log(`🚀 Server running on port ${Port}`)
})
})