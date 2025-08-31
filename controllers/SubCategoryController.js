import { request, response } from "express"
import uploadImageCloudinary from "../util/uploadImageCloudinary.js";
import SubCategory from "../models/subCategory.js";
import { v2 as cloudinary } from "cloudinary";


//create subcategory
export const createSubCategory = async(request,response)=>{
    try {
        //get name category id
        const{name,categoryId}=request.body;
        if(!name||!categoryId||!request.file){
            return response.status(400).json({
                message:"Name, Image and CategoryId are required",
                error:true,
                sucess:false,
            })

        }
        //check sub category in data base
        const exisitsubcategory=await SubCategory.findOne({name});

        if(exisitsubcategory){
            return response.status(400).json({
                message:'sub Category already exists',
                erroe:true,
                success:false
            })
        }


        //get image file 
        const imageFile=request.file;

        //uplod image to cloudinary
        const uploadImage=await uploadImageCloudinary(imageFile)

        const payload={
            name,
            image:uploadImage.secure_url,
            categoryId,
        }

        //save database
        const subCategory= await SubCategory(payload).save();

        return response.status(200).json({
            message: "SubCategory created", 
            data: subCategory ,
            error:false,
            success:true
        })
   
    } 
    catch (error) {
        return response.status(500).json({
            message: "Server error", 
            error: error.message
        })
    }
}

//update subcategory
export const updateSubCategory = async(request,response)=>{
    try {
        const{name,categoryId}=request.body;
        let updateData={name,categoryId};

        //if a new image is uploaded replace it in cloudinary
        const imageFile=request.file;

        //get category
        const subCategory=await SubCategory.findOne({name})

        if(!subCategory){
            return response.status(404).json({
                message:'Sub Category not found',
                error:true,
                success:false,
            })
        }

        // image url
        let imageurl=subCategory.image;
        if(imageurl){
                const publicId = subCategory.image.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(`online-shopping-site/${publicId}`);
            }
            // Upload new image
            const uploaded = await uploadImageCloudinary(request.file);
             updateData.image = uploaded.secure_url;

            //update subcategory
            const updated=await SubCategory.findByIdAndUpdate(
                request.params.id,
                updateData,
                { new: true, runValidators: true }
            );

            return response.status(200).json({
                message: "SubCategory updated", 
                data: updated,
                error:false,
                success:true,
            })
    
    } 
    catch (error) {
        return response.status(500).json({
            message: "Server error", 
            error: error.message
        })
    }
}

//get all subcategory
export const getAllSubCategories = async(request,response)=>{
    try {
        const subCategory =await SubCategory.find().populate("categoryId",'name');
        response.status(200).json({
            message:"retreview all subcategory",
            data:subCategory,
            error:false,
            sucess:true,
        })
    } catch (error) {
         return response.status(500).json({
            message: "Server error", 
            error: error.message
        })
    }
}

// Get SubCategory By NAME
export const getSubCategoryByName= async(request,response)=>{
    try {
        const {name}=request.params;

        //find subcategory by name (use case sensitive)
        const subCategory = await SubCategory.findOne({ name: { $regex: `^${name}$`, $options: "i" } }).populate("categoryId", "name");

        if(!subCategory){
            return response.status(400).json({
                message:'SubCategory not found',
                error:true,
                sucess:false
            })
        }

        return response.status(200).json({
            message:'subcategory find',
            data:subCategory,
            error:false,
            success:true,

        })
        
    } catch (error) {
        return response.status(500).json({
            message: "Server error", 
            error: error.message
        })
    }

}

//delete subcategory
export const deleteSubCategory=async(request,response)=>{
    try {
        //get id usin params
    const {subcategoryId}=request.params;

    const deleted=await SubCategory.findByIdAndDelete(subcategoryId);
    
    if(!deleted){
        return response.status(400).json({
            message:'SubCategory not found',
            error:true,
            sucess:false
        })
    }
    response.status(200).json({
        message:'SubCategory deleted',
        error:true,
        sucess:false,
    })
        
    } catch (error) {
        return response.status(500).json({
            message: "Server error", 
            error: error.message
        })
    }
}