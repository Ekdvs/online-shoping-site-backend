import { request, response } from "express";
import uploadImageCloudinary from "../util/uploadImageCloudinary.js";
import SubCategory from "../models/subCategory.js";
import { v2 as cloudinary } from "cloudinary";
import Category from "../models/category.model.js";

// Create Subcategory
export const createSubCategory = async (request, response) => {
  try {
    const { name, categoryId } = request.body;
    //check all field
    if (!name || !categoryId || !request.file) {
      return response.status(400).json({
        message: "Name, Image and CategoryId are required",
        success: false,
        error:true
      });
    }

    //find subcategory form database aviable
    const exists = await SubCategory.findOne({ name });
    if (exists) {
      return response.status(400).json({
        message: "SubCategory already exists",
        success: false,
        error:true,
      });
    }

    //image get
    const uploadImage = await uploadImageCloudinary(request.file);

    //create subcategoty
    const subCategory = await SubCategory.create({
      name,
      image: uploadImage.secure_url,
      categoryId,
    });

    return response.status(201).json({
      message: "SubCategory created",
      data: subCategory,
      success: true,
      error:false
    });
  } catch (error) {
    return response.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Update Subcategory
export const updateSubCategory = async (request, response) => {
  try {
    const { name, categoryId } = request.body;

    //find subcategory from data base
    const subCategory = await SubCategory.findById(request.params.id);
    if (!subCategory) {
      return response.status(404).json({
        message: "SubCategory not found",
        success: false,
        error:true
      });
    }

    let updateData = { name, categoryId };

    // If new image uploaded
    if (request.file) {
      // Delete old image
      if (subCategory.image) {
        const parts = subCategory.image.split("/");
        const publicId = parts[parts.length - 1].split(".")[0];
        await cloudinary.uploader.destroy(`online-shopping-site/${publicId}`);
      }

      const uploaded = await uploadImageCloudinary(request.file);
      updateData.image = uploaded.secure_url;
    }

    const updated = await SubCategory.findByIdAndUpdate(
      request.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    return response.status(200).json({
      message: "SubCategory updated successfully",
      data: updated,
      success: true,
      error:false
    });
  } catch (error) {
    return response.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Get All Subcategories
export const getAllSubCategories = async (request, response) => {
  try {
    //get all subcategories
    const subCategory = await SubCategory.find().populate("categoryId", "name");
    response.status(200).json({
      message: "Retrieved all subcategories",
      data: subCategory,
      success: true,
      error:false,
    });
  } catch (error) {
    return response.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Get SubCategory By Name
export const getSubCategoryByName = async (request, response) => {
  try {
    //get name
    const { name } = request.params;

    //find the subcategory from data base
    const subCategory = await SubCategory.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    }).populate("categoryId", "name");

    if (!subCategory) {
      return response.status(200).json({
        message: "No subcategory found",
        data: null,
        success: false,
        errror:true
      });
    }

    return response.status(200).json({
      message: "Subcategory found",
      data: subCategory,
      success: true,
      error:false
    });
  } catch (error) {
    return response.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Delete Subcategory
export const deleteSubCategory = async (request, response) => {
  try {
    //get subcategory id
    const { id } = request.params;

    // subcategory delete
    const deleted = await SubCategory.findByIdAndDelete(id);

    if (!deleted) {
      return response.status(404).json({
        message: "SubCategory not found",
        success: false,
      });
    }

    return response.status(200).json({
      message: "SubCategory deleted",
      success: true,
    });
  } catch (error) {
    return response.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

// Get Subcategory by ID
export const getSubCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const subCategory = await SubCategory.findById(id).populate("categoryId", "name");
    
    if (!subCategory) {
      return res.status(404).json({ success: false, message: "Subcategory not found" });
    }

    return res.status(200).json({
      success: true,
      data: subCategory,
    });
  } catch (error) {
    console.error("Error fetching subcategory:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch subcategory",
      error: error.message,
    });
  }
};

// Get Subcategories by Category (id or name)
export const getSubCategoriesByCategory = async (request, response) => {
  try {
    //get keyword
    const { idOrName } = request.params;

    let categoryId;

    // If valid ObjectId → use directly
    if (/^[0-9a-fA-F]{24}$/.test(idOrName)) {
      categoryId = idOrName;
    } else {
      // Find category by name
      const category = await Category.findOne({
        name: { $regex: `^${idOrName}$`, $options: "i" },
      });
      categoryId = category?._id;
    }

    if (!categoryId) {
      return response.status(404).json({
        message: "Category not found",
        success: false,
      });
    }


    //find in data base
    const subcategories = await SubCategory.find({ categoryId }).populate(
      "categoryId",
      "name"
    );

    response.status(200).json({
      message: "Subcategories retrieved",
      data: subcategories,
      success: true,
    });
  } catch (error) {
    //console.error(error);
    response.status(500).json({
      message: "Server error",
      error: error.message,
      success: false,
    });
  }
};
