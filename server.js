import express from 'express'
import connectDB from "./configs/db.js";
import dotenv from "dotenv";
import userRouter from './routers/userRoute.js';



const app= express();
dotenv.config();

// Middleware
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); //

//Routes
app.use("/api/user",userRouter);

const Port=process.env.PORT||5000;

connectDB().then(()=>{
    app.listen(Port,()=>{
    console.log(`🚀 Server running on port ${Port}`)
})
})