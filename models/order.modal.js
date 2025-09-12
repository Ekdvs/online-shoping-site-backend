import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref:'User',
      required:[true,'Provide User id'],
    },
    orderId: {
      type: String,
      required: [true,'Provide Order id'],
      unique: true,
      trim: true,
    },
    product_details: {
      type: String,
      default: "",
    },
    payment_id: {
      type: String,
      requred: [true,'Provide payment id'],
    },
    payment_status: {
      type: String,
      required: [true,'Provide payment status'],
      enum: ["pending", "completed", "failed"], // optional validation
      default: "pending",
    },
      delivery_address: {
      type: mongoose.Schema.ObjectId,
      ref: "Address",
      required: [true, "Provide delivery addresponses"],
    },

    delivery_status: {
      type: String,
      enum: ["pending", "shipped", "delivered", "cancelled"], // optional validation
      default: "pending",
    },
    subTotalAmt: {
      type: Number,
      required: true,
    },
    totalAmt: {
      type: Number,
      required: true,
    },
    invoice_receipt: {
      type: String,
    },
  },
  {
    timestamps: true, 
  }
);

const Order=mongoose.model("Order", orderSchema);
export default Order;
