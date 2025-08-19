import mongoose from "mongoose";

const cartProductSchema=new mongoose.Schema(
    {
        productId:{
            type:mongoose.Schema.ObjectId,
            ref:'Product'

        },
        quentity:{
            type:Number,
            required:true,
            min:1
        },
        userId:{
            type:mongoose.Schema.ObjectId,
            ref:'User',
            required:true
        },
        createdAt:{
            type:Date,
        },
        updatedAt:{
            type:Date,
        }

    }
    ,{
        timestamps:true
    }
)

export default mongoose.model('CartProduct',cartProductSchema)