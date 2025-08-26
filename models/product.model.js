import mongoose from "mongoose";

const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Provide Product name'],
        trim: true,
    },
    image:{
        type:[String],
        required:[true,'Provide Product image'],
    },
    categoryId:{
        type:mongoose.Schema.ObjectId,
        ref:'Category',
        required:[true,'Provide category id'],
    },
    sub_categoryId:{
        type:mongoose.Schema.ObjectId,
        ref:'SubCategory',

    },
    unit:{
        type:String,
        required:[true,'Provide Product Unit'],
    },
    stock:{
        type:Number,
        required:[true,'Provide Product Strock Number'],

    },
    price:{
        type:Number,
        required:[true,'Provide Product Price'],
    },
    discount:{
        type:Number,

    },
    description:{
        type:String,
    },
    more_Details:{
        type:Object,
    },
    publish:{
        type:Boolean,
        default:'true'
    }


}
,{
    timestamps:true
}
)

export default mongoose.model('Product',productSchema)