import { response } from "express";
import Product from "../models/product.model.js";
import uploadImageCloudinary from "../util/uploadImageCloudinary.js";


//create product
export const createProduct=async(request,response)=>{
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



    //validate required feilds
    if (!name || !categoryId || !unit || !stock || !price || !request.files) {
      return response.status(400).json({
        message: "Name, Category, Unit, Stock, Price, and Images are required",
        error: true,
        success: false,
      });
    }

    //upload multiple images to cloudinary
    const uploadedImages = await Promise.all(
      req.files.map((file) => uploadImageCloudinary(file))
    );

    //get image url
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

    return response.status(201).json({
        message: "Product created successfully",
        data: product,
        error: false,
        success: true,
    })
    } catch (error) {
        return response.status(500).json({ 
             message: "Server error",
             error: error.message 
            });
    }
}

//get all product
export const getAllProducts=async(request,response)=>{
    try {
        //get all producs
        const products=await Product.find()
        .populate('categoryId','name','image')
        .populate("sub_categoryId", "name",'image')

        //reponse all products
        return response.status(200).json({
            message: "Retrieved all products",
            data: products,
            error: false,
            success: true,
        })
        
    } catch (error) {
        return response.status(500).json({ 
             message: "Server error",
             error: error.message 
            });
    }
}
