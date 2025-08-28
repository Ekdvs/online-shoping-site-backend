import { request, response } from "express";
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

//getproductbyid
export const getProductById=async(request,responce)=>{
    try {
        //get product id
        const {productId}=request.params

        const product=await Product.findById(productId)
        .populate("categoryId", "name")
         .populate("sub_categoryId", "name");

        //check product avalibility
        if(!product){
            return response.status(404).json({
                message:'product not found',
                error:true,
                success:false,
            })
        }

        return responce.status(200).json({
            message:'retview the product',
            data: product, 
            error: false, 
            success: true 
        })


        
    } 
    catch (error) {
        return response.status(500).json({ 
             message: "Server error",
             error: error.message 
            });
    }
}

//update product
export const updateProduct=async(request,response)=>{
    try {
        const{id}=request.params;
        let updateData={...request.body}

        //check id
        if(!id){
            return res.status(404).json({ 
                message: "product id not found" ,
                error:true,
                success:false,
            })
        }

        // If new images are uploaded
    if (request.files && request.files.length > 0) {
      const uploadedImages = await Promise.all(
        req.files.map((file) => uploadImageCloudinary(file))
      );
      updateData.image = uploadedImages.map((img) => img.secure_url);
    }

    const updated = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ 
        message: "Product not found" ,
        error:true,
        success:false,
    });
    }

    return response.status(200).json({
        message: "Product updated successfully",
      data: updated,
      error: false,
      success: true,
    })

    } 
    catch (error) {
        return response.status(500).json({ 
             message: "Server error",
             error: error.message 
            });
    }
}

//delete product
export const deleteproduct=async(request,response)=>{
    try {
            const{id}=request.params;
       

        //check id
        if(!id){
            return res.status(404).json({ 
                message: "product id not found" ,
                error:true,
                success:false,
            })
        }

        //delete from data base

        const productdeleted=await Product.findByIdAndDelete(id);

        if(!productdeleted){
             return res.status(404).json({ 
                message: " can not find product" ,
                error:true,
                success:false,
            })
        }

        return response.status(200).json({
            message: "Product deleted successfully",
            error:false,
            success:true,
        })


        
    } catch (error) {
         return response.status(500).json({ 
             message: "Server error",
             error: error.message 
            });
    }
}

//search product by by name or description
export const searchProduct=async(request,response)=>{
    try {
        //get keyword
        const {keyword}=request.body;
        if(!keyword){
            return response.status(404).json({
                message:'Can not find key word',
                error:true,
                success:false
            })
        }
        const products=await Product.find({
            $or:[
                {name:{$regex:keyword,$option:'i'}},
                {description:{$regex:keyword,$option:'i'}}
            ],
        })

        //avaliable check
        if(!products){
            return response.status(404).json({
                message:'Can not find products this keyword',
                error:true,
                success:false
            })
        }

        return response.status(200).json({
            message:'Search results',
            data:products,
            error:false,
            success:true,
        })
        
    } 
    catch (error) {
         return response.status(500).json({ 
             message: "Server error",
             error: error.message 
            });
    }
}

//filter products by category ,price,stock,etc
export const fillterProducts=async(request,response){
    try {

        // fiter by results
        const { category, minPrice, maxPrice, inStock } = req.query;
        let filters={};

        if (category) filters.categoryId = category;
        if (inStock) filters.stock = { $gt: 0 };
        if (minPrice || maxPrice) {
            filters.price = {};
            if (minPrice) filters.price.$gte = Number(minPrice);
            if (maxPrice) filters.price.$lte = Number(maxPrice);
        }

        const products =await product.find(filters);

        return response.status(200).json({
            message: "Filtered products",
            data: products,
            error: false,
            success: true,
        })
        
    } 
    catch (error) {
         return response.status(500).json({ 
             message: "Server error",
             error: error.message 
            });
    }
}

