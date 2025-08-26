import express from 'express'
import auth from '../middleweare/auth.js';
import admin from '../middleweare/admin.js';
import upload from '../middleweare/multer.js';
import { createSubCategory, updateSubCategory } from '../controllers/SubCategoryController.js';
const subCategoryRouter = express.Router(); 

// Create subcategory (Admin only, with image upload)
subCategoryRouter.post("/create", auth, admin, upload.single("image"), createSubCategory);

// Update subcategory (Admin only, with optional image upload)
subCategoryRouter.put("/update/:id", auth, admin, upload.single("image"), updateSubCategory);


export default subCategoryRouter;
