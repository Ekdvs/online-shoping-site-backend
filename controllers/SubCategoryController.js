import { request, response } from "express"
import uploadImageCloudinary from "../util/uploadImageCloudinary.js";
import SubCategory from "../models/subCategory.js";


//create subcategory
export const createSubCategory = async(request,response)=>{
    try {
        //get name category id
        const{name,categoryId}=request.body;
        if(!name||!categoryId||request.file){
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