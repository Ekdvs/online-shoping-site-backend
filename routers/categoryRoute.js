import express from 'express'
import { createCategory } from '../controllers/categoryController';
import admin from '../middleweare/admin';
import auth from '../middleweare/auth';
import upload from '../middleweare/multer';
const categoryRouter = express.Router(); 

//create category
categoryRouter.post('/create',auth,admin ,upload.single("image"), createCategory);

//get all category

export default categoryRouter;