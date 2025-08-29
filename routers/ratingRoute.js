import express from "express";
import auth from "../middleweare/auth.js";
import { addReview, deleteReview, getReviews, updateReview } from "../controllers/reviewController.js";
import admin from '../middleweare/admin.js';


const ratingRouter=express.Router();

//add review
ratingRouter.post('/create',auth,addReview);
//get all reviews
ratingRouter.get('/getall/:productId',getReviews)
//update 
ratingRouter.put('/update/:reviewId',auth,updateReview)
//delete rating 
ratingRouter.delete("/:reviewId", auth,admin, deleteReview); 

export default ratingRouter;