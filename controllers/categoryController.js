import Category from "../models/category.model";


//create category
export const createCategory=async (request,response)=>{
    try {
        const{name}=request.body;
        const imageFile =request.file;

        //check name and image exist
        if(!name||!imageFile){
            return response.status(400).json({
                message:'Name and Image provide',
                erroe:true,
                success:false
            })
        }

        //check category in data base
        const exisitcategory=await Category.findOne({name});

        if(exisitcategory){
            return response.status(400).json({
                message:'Category already exists',
                erroe:true,
                success:false
            })
        }

        //upload image cloudinary 
        const uploadedImage = await uploadImageCloudinary(imageFile);
        //create payload
        const payload={
            name,
            image:uploadedImage.secure_url,

        }
        //create catalogy in database
        const category=await Category(payload).save();

        return response.status(201).json({
            message:'Category created',
                data:category,
                erroe:false,
                success:true,
        })


    } catch (error) {
        return response.status(500).json({ 
            message: "Server error", 
            error: error.message,
            error:true,
            success:false,
        });
    }
}

//get all category
export const getAllCategories=async(request,response)=>{
    try {
        const categories=await Category.find();

        return response.status(200).json({
            message:'retview all categories',
            data:categories,
            error:false,
            success:true,
        })
        
    } catch (error) {
        return response.status(500).json({
            message:'Server error'+error.message,
            error:true,
            success:false,
        })
        
    }

}

//update category
export const updateCategory=async(request,response)=>{
    try {
        //get details from
        const name= request.body;

        //find category from dat base
        const category =await Category.findOne({name});

        if(!category){
            return response.status(404).json({
                message:'Category not found',
                error:true,
                success:false,
            })
        }

        // image url
        let imageurl=category.image;

        //if add new image
        if(request.file){
            if(imageurl){
                const publicId = category.image.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(`online-shopping-site/${publicId}`);
            }
            // Upload new image
            const uploaded = await uploadImageCloudinary(req.file);
            imageurl = uploaded.secure_url;

        }

        category.name = name || category.name;
        category.image = imageurl;
        const updated = await category.save();

        return response.status(200).json({
            message:'Category updated',
            data:updated,
            error:false,
            success:true,
        })


    } catch (error) {
        return response.status(500).json({
            message:"server error"+error.message,
            error:true,
        })
        
    }
}

// delete category
export 