import express from 'express'
import connectDB from "./configs/db.js";
import dotenv from "dotenv";


const app= express();
dotenv.config();

// Middleware
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); //

const Port=process.env.PORT||5000;

connectDB().then(()=>{
    app.listen(Port,()=>{
    console.log(`🚀 Server running on port ${Port}`)
})
})