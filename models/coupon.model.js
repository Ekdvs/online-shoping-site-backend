// models/couponModel.js
import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      trim: true,
    },
    discountPercent: {
      type: Number,
      required: [true, "Discount percentage is required"],
      min: 1,
      max: 100,
    },
    expiryDate: {
      type: Date,
      required: [true, "Expiry date is required"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      default: "",
    },
    usageLimit: {
      type: Number, // Number of times coupon can be used
      default: 0,   // 0 means unlimited
    },
    usedCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Optional: Automatically deactivate expired coupons
couponSchema.pre("save", function (next) {
  if (this.expiryDate < Date.now()) {
    this.isActive = false;
  }
  next();
});
const Coupon=mongoose.model("Coupon", couponSchema);
export default Coupon;
