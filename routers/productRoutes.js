import express from "express";
import admin from '../middleweare/admin.js';
import auth from '../middleweare/auth.js';
import upload from '../middleweare/multer.js';
import { createProduct, deleteproduct, fillterProducts, getAllProducts, getProductById, searchProduct, updateProduct } from "../controllers/productController.js";

const productRouter=express.Router();

//create product by admin
productRouter.post('/create',auth,admin,upload.array('images',5),createProduct);

//get all products
productRouter.get('/getall',getAllProducts);

//get product by id
productRouter.get('/getbyid/:id',getProductById);

//update product by id
productRouter.put('/update/:id',auth,admin,upload.array('images',5),updateProduct);

//delete product by id
productRouter.delete('/delete/:id',auth,admin,deleteproduct);

//search products
productRouter.get('/search',searchProduct);

//filter product
productRouter.get('/filter',fillterProducts);


export default productRouter;