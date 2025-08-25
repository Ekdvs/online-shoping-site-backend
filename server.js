import express from 'express'
import connectDB from "./configs/db.js";
import dotenv from "dotenv";
import userRouter from './routers/userRoute.js';
import cookieParser from "cookie-parser";
import categoryRouter from './routers/categoryRoute.js';


const app= express();
dotenv.config();
app.use(cookieParser());

// Middleware
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); //

//Routes
app.use("/api/user",userRouter);
app.use('/api/category',categoryRouter)

const Port=process.env.PORT||5000;

connectDB().then(()=>{
    app.listen(Port,()=>{
    console.log(`🚀 Server running on port ${Port}`)
})
})