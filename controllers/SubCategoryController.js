import { request, response } from "express";
import uploadImageCloudinary from "../util/uploadImageCloudinary.js";
import SubCategory from "../models/subCategory.js";
import { v2 as cloudinary } from "cloudinary";

// Create Subcategory
export const createSubCategory = async (req, res) => {
  try {
    const { name, categoryId } = req.body;
    if (!name || !categoryId || !req.file) {
      return res.status(400).json({
        message: "Name, Image and CategoryId are required",
        success: false,
      });
    }

    const exists = await SubCategory.findOne({ name });
    if (exists) {
      return res.status(400).json({
        message: "SubCategory already exists",
        success: false,
      });
    }

    const uploadImage = await uploadImageCloudinary(req.file);

    const subCategory = await SubCategory.create({
      name,
      image: uploadImage.secure_url,
      categoryId,
    });

    return res.status(201).json({
      message: "SubCategory created",
      data: subCategory,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update Subcategory
export const updateSubCategory = async (req, res) => {
  try {
    const { name, categoryId } = req.body;

    const subCategory = await SubCategory.findById(req.params.id);
    if (!subCategory) {
      return res.status(404).json({
        message: "SubCategory not found",
        success: false,
      });
    }

    let updateData = { name, categoryId };

    // If new image uploaded
    if (req.file) {
      // Delete old image
      if (subCategory.image) {
        const parts = subCategory.image.split("/");
        const publicId = parts[parts.length - 1].split(".")[0];
        await cloudinary.uploader.destroy(`online-shopping-site/${publicId}`);
      }

      const uploaded = await uploadImageCloudinary(req.file);
      updateData.image = uploaded.secure_url;
    }

    const updated = await SubCategory.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      message: "SubCategory updated successfully",
      data: updated,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get All Subcategories
export const getAllSubCategories = async (req, res) => {
  try {
    const subCategory = await SubCategory.find().populate("categoryId", "name");
    res.status(200).json({
      message: "Retrieved all subcategories",
      data: subCategory,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get SubCategory By Name
export const getSubCategoryByName = async (req, res) => {
  try {
    const { name } = req.params;
    const subCategory = await SubCategory.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    }).populate("categoryId", "name");

    if (!subCategory) {
      return res.status(200).json({
        message: "No subcategory found",
        data: null,
        success: false,
      });
    }

    return res.status(200).json({
      message: "Subcategory found",
      data: subCategory,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete Subcategory
export const deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await SubCategory.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        message: "SubCategory not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "SubCategory deleted",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
