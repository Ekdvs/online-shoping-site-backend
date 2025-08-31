// controllers/productController.js
import { request, response } from "express";
import Product from "../models/product.model.js";
import uploadImageCloudinary from "../util/uploadImageCloudinary.js";
import { v2 as cloudinary } from "cloudinary";

// Create Product
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      categoryId,
      sub_categoryId,
      unit,
      stock,
      price,
      discount,
      description,
      more_Details,
      publish,
    } = req.body;

    if (!name || !categoryId || !unit || !stock || !price || !req.files) {
      return res.status(400).json({
        message: "Name, Category, Unit, Stock, Price, and Images are required",
        error: true,
        success: false,
      });
    }

    const uploadedImages = await Promise.all(
      req.files.map((file) => uploadImageCloudinary(file))
    );

    const imageUrls = uploadedImages.map((img) => img.secure_url);

    const product = await Product.create({
      name,
      image: imageUrls,
      categoryId,
      sub_categoryId,
      unit,
      stock,
      price,
      discount,
      description,
      more_Details,
      publish,
    });

    return res.status(201).json({
      message: "Product created successfully",
      data: product,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get All Products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("categoryId", "name image")
      .populate("sub_categoryId", "name image");

    return res.status(200).json({
      message: "Retrieved all products",
      data: products,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get Product By ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    

    const product = await Product.findById(id)
      .populate("categoryId", "name")
      .populate("sub_categoryId", "name");

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      message: "Product retrieved successfully",
      data: product,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Update Product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let updateData = { ...req.body };

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        error: true,
        success: false,
      });
    }

    if (req.files && req.files.length > 0) {
      if (product.image && product.image.length > 0) {
        await Promise.all(
          product.image.map(async (imgUrl) => {
            const parts = imgUrl.split("/");
            const fileName = parts[parts.length - 1];
            const publicId = fileName.split(".")[0];
            await cloudinary.uploader.destroy(publicId);
          })
        );
      }

      const uploadedImages = await Promise.all(
        req.files.map((file) => uploadImageCloudinary(file))
      );
      updateData.image = uploadedImages.map((img) => img.secure_url);
    }

    const updated = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      message: "Product updated successfully",
      data: updated,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Delete Product
export const deleteproduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        error: true,
        success: false,
      });
    }

    if (product.image && product.image.length > 0) {
      await Promise.all(
        product.image.map(async (imgUrl) => {
          const parts = imgUrl.split("/");
          const fileName = parts[parts.length - 1];
          const publicId = fileName.split(".")[0];
          await cloudinary.uploader.destroy(publicId);
        })
      );
    }

    await Product.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Product deleted successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Search Product
export const searchProduct = async (req, res) => {
  try {
    const { keyword } = req.query;

    const products = await Product.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    });

    return res.status(200).json({
      message: "Search results",
      data: products,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Filter Products
export const fillterProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, inStock } = req.query;
    let filters = {};

    if (category) filters.categoryId = category;
    if (inStock) filters.stock = { $gt: 0 };
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = Number(minPrice);
      if (maxPrice) filters.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(filters);

    return res.status(200).json({
      message: "Filtered products",
      data: products,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
