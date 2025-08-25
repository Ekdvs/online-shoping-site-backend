import mongoose from "mongoose";    

const sub_categorySchema=new mongoose.Schema(
    {
        name:{ 
            type:String,
            required:[true,'Provide Sub category name']
        },
        image:{
            type:String,
            required:true,
        },
        categoryId:{
            type:[mongoose.Schema.ObjectId],
            ref:'Category',
            required:[true,'Provide Sub category image'],
        },

    },
    {
        timestamps:true,
    }
)
const SubCategory=mongoose.model('SubCategory',sub_categorySchema)
export default SubCategory;