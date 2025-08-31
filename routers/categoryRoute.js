import express from 'express'
import { createCategory, deleteCategory, getAllCategories, getCategorybyname, updateCategory } from '../controllers/categoryController.js';
import admin from '../middleweare/admin.js';
import auth from '../middleweare/auth.js';
import upload from '../middleweare/multer.js';
const categoryRouter = express.Router(); 

//create category
categoryRouter.post('/create',auth,admin ,upload.single("image"), createCategory);

//get all category
categoryRouter.get('/getall',getAllCategories);

//delete category by addmin
categoryRouter.delete('/delete',auth,admin,deleteCategory)


//search category by name
categoryRouter.post('/search',getCategorybyname)

//update
categoryRouter.put('/update/:id',auth,admin,upload.single("image"),updateCategory)

export default categoryRouter;