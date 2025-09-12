import express from 'express'
import auth from '../middleweare/auth.js';
import admin from '../middleweare/admin.js';
import upload from '../middleweare/multer.js';
import { createSubCategory, deleteSubCategory, getAllSubCategories, getSubCategoriesByCategory, getSubCategoryById, getSubCategoryByName, updateSubCategory } from '../controllers/SubCategoryController.js';
const subCategoryRouter = express.Router(); 

// Create subcategory (Admin only, with image upload)
subCategoryRouter.post("/create", auth, admin, upload.single("image"), createSubCategory);

// Update subcategory (Admin only, with optional image upload)
subCategoryRouter.put("/update/:id", auth, admin, upload.single("image"), updateSubCategory);

//searchsubcstegory by name
subCategoryRouter.get('/search/:name',getSubCategoryByName);

//get all subcategories
subCategoryRouter.get('/getall',getAllSubCategories);

//delete subcategory(admin only)
subCategoryRouter.delete('/delete/:id',auth,admin,deleteSubCategory)

// Get subcategory by ID
subCategoryRouter.get("/get/:id", getSubCategoryById);

//get all subcategories using category idor name
subCategoryRouter.get("/byCategory/:idOrName", getSubCategoriesByCategory);

export default subCategoryRouter;