import express from "express";
import admin from "../middleweare/admin.js";
import auth from "../middleweare/auth.js";
import upload from "../middleweare/multer.js";
import {
  createProduct,
  deleteProduct,
  filterProducts,
  getAllProducts,
  getProductById,
  getProductsBySubCategory,
  searchProduct,
  updateProduct,
} from "../controllers/productController.js";

const productRouter = express.Router();

// Create product by admin
productRouter.post("/create", auth, admin, upload.array("images", 5), createProduct);

// Get all products
productRouter.get("/getall", getAllProducts);

// Get product by id
productRouter.get("/getbyid/:id", getProductById);

// Update product by id
productRouter.put("/update/:id", auth, admin, upload.array("images", 5), updateProduct);

// Delete product by id
productRouter.delete("/delete/:id", auth, admin, deleteProduct);

// Search products
productRouter.get("/search", searchProduct);

// Filter products
productRouter.get("/filter", filterProducts);

// Get products by subcategory
productRouter.get("/get/:id", getProductsBySubCategory );

export default productRouter;
