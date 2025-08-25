import Category from "../models/category.model";


//create category
export const createCategory=async (request,response)=>{
    try {
        const{name,image}=request.body;

        //check name and image exist
        if(!name||!image){
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

        //create payload
        const payload={
            name,
            image

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