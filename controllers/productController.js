// controllers/productController.js
import Product from "../models/product.model.js";
import SubCategory from "../models/subCategory.js";
import uploadImageCloudinary from "../util/uploadImageCloudinary.js";
import { v2 as cloudinary } from "cloudinary";

// Create Product
export const createProduct = async (request, response) => {
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
    } = request.body;

    // check required fields
    if (!name || !categoryId || !unit || !stock || !price || !request.files) {
      return response.status(400).json({
        message: "Name, Category, Unit, Stock, Price, and Images are required",
        error: true,
        success: false,
      });
    }

    // upload images to cloudinary
    const uploadedImages = await Promise.all(
      request.files.map((file) => uploadImageCloudinary(file))
    );

    const imageUrls = uploadedImages.map((img) => img.secure_url);

    // save product in DB
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

    return response.status(201).json({
      message: "Product created successfully",
      data: product,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get All Products
export const getAllProducts = async (request, response) => {
  try {
    const products = await Product.find()
      .populate("categoryId", "name image")
      .populate("sub_categoryId", "name image");

    return response.status(200).json({
      message: "Retrieved all products",
      data: products,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get Product By ID

export const getProductById = async (request, response) => {
  try {
    const { id } = request.params;

    const product = await Product.findById(id)
      .populate("categoryId", "name")
      .populate("sub_categoryId", "name");

    if (!product) {
      return response.status(404).json({
        message: "Product not found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      message: "Product retrieved successfully",
      data: product,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Update Product
export const updateProduct = async (request, response) => {
  try {
    const { id } = request.params;
    let updateData = { ...request.body };

    const product = await Product.findById(id);

    if (!product) {
      return response.status(404).json({
        message: "Product not found",
        error: true,
        success: false,
      });
    }

    // replace images if new ones are uploaded
    if (request.files && request.files.length > 0) {
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
        request.files.map((file) => uploadImageCloudinary(file))
      );
      updateData.image = uploadedImages.map((img) => img.secure_url);
    }

    const updated = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return response.status(200).json({
      message: "Product updated successfully",
      data: updated,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Delete Product
export const deleteProduct = async (request, response) => {
  try {
    const { id } = request.params;

    const product = await Product.findById(id);

    if (!product) {
      return response.status(404).json({
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

    return response.status(200).json({
      message: "Product deleted successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Search Product
export const searchProduct = async (request, response) => {
  try {
    const { keyword } = request.query;

    const products = await Product.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    });

    return response.status(200).json({
      message: "Search results",
      data: products,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Filter Products
export const filterProducts = async (request, response) => {
  try {
    const { category, minPrice, maxPrice, inStock } = request.query;
    let filters = {};

    if (category) filters.categoryId = category;
    if (inStock) filters.stock = { $gt: 0 };
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = Number(minPrice);
      if (maxPrice) filters.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(filters);

    return response.status(200).json({
      message: "Filtered products",
      data: products,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

//get all products for usin subcategory
export const getProductsBySubCategory = async (req, res) => {
  try {
    const { id } = req.params; // subcategory ID

    // Check if subcategory exists
    const subCategory = await SubCategory.findById(id);
    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: "Subcategory not found",
      });
    }

    // Find products under this subcategory
    const products = await Product.find({ sub_categoryId: id })
      .populate("sub_categoryId", "name")
      .populate("categoryId", "name");

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};


