import mongoose from "mongoose";

const addressSchema=new mongoose.Schema(
    {userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique:true
    },
        address_line:{
            type:String,
            default:'',
        },
        city:{
            type:String,
            default:'',
        },
        state:{
            type:String,
            default:'',
        },
        pincode:{
            type:String,
            default:'',
        },
        country:{
            type:String,
            default:'',
        },
        mobile:{
            type:Number,
            default:'',
        },
    }
    ,{
        timestamps:true
    }
)
const AddressModel=mongoose.model('Address',addressSchema)
export default AddressModel;