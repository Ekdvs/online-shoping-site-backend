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
    },
    status: {
      type: String,
      default: "ACTIVE",
      enum: ["ACTIVE", "INACTIVE"],
    },

    // ✅ Store address details properly
    address_details: [
      {
        street: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        postalCode: { type: String, trim: true },
        country: { type: String, trim: true },
      },
    ],

    // ✅ Shopping cart should store product references
    shopping_cart: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1, min: 1 },
      },
    ],

    // ✅ Order history should reference orders
    orderHistory: [
      {
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
        purchasedAt: { type: Date, default: Date.now },
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
