import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Provide Name"],
      trim: true,
      
    },
    email: {
      type: String,
      required: [true, "Provide Email"],
      unique: true,
      lowercase: true, 
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Provide Password"],
      trim: true,
      minlength: [6, "Password must be at least 6 characters"],
    },
    avatar: {
      type: String,
      default: "", 
    },
    mobile: {
      type: String, 
      trim: true,
    },
    refresh_token: {
      type: String,
      default: "",
    },
    verify_email: {
      type: Boolean,
      default: false,
    },
    last_login_date: {
      type: Date,
      default:"",

    },
    status: {
      type: String,
      default: "ACTIVE",
      enum: ["ACTIVE", "INACTIVE"],
    },

    // ✅ Store address details properly
    address_details:[
      {
        type: mongoose.Schema.ObjectId,
        ref:'address'
    }
  ] 
      ,

    // ✅ Shopping cart should store product references
    shopping_cart: [
      {
        type:mongoose.Schema.ObjectId,
        ref:'cartProduct',
      },
    ],

    // ✅ Order history should reference orders
    orderHistory: [
      {
        type:mongoose.Schema.ObjectId,
        ref:'order',
      },
    ],

    forgot_password_otp: {
      type: String,
      default: "",
    },
    forgot_password_expiry: {
      type: Date,
    },

    role: {
      type: String,
      default: "USER",
      enum: ["USER", "ADMIN"],
    },
  },
  
  {
    timestamps: true, //  automatically creates createdAt & updatedAt
  }
);

export default mongoose.model("User", userSchema);
