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
            ref:'Catrrgory',
            required:[true,'Provide Sub category image'],
        },

    },
    {
        timestamps:true,
    }
)

export default mongoose.model('SubCategory',sub_categorySchema)