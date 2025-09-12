
import CartProduct from "../models/cartProduct.model.js";
import Coupon from "../models/coupon.model.js";

//  Create Coupon
export const createCoupon = async (request, response) => {
  try {
    const { code, discountPercent, expiryDate, description, usageLimit } = request.body;

    //check all field
    if(!code||!discountPercent||!expiryDate||!description||!usageLimit){
      return response.status(400).json({
        message:'All field required',
        error:true,
        sucess:false
      })

    }
    const coupon = new Coupon({
      code: code.toUpperCase(),
      discountPercent,
      expiryDate,
      description,
      usageLimit,
    });

    // data base
    await coupon.save();
    response.status(201).json({ 
      success: true, 
      message: "Coupon created", 
      coupon ,
      sucess:false
    });
  } catch (error) {
    response.status(500).json({ 
      success: false, 
      message: error.message,

    });
  }
};

// Get All Coupons
export const getCoupons = async (request, response) => {
  try {
    //find coupn from data base
    const coupons = await Coupon.find();
    response.status(200).json({ 
      success: true, 
      coupons,
      message: "Retview all coupon"
    });
  } catch (error) {
    response.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Update Coupon
export const updateCoupon = async (request, response) => {
  try {
    //get coupon id
    const { id } = request.params;
    //find and update coupon
    const updated = await Coupon.findByIdAndUpdate(id, request.body, 
      { new: true, runValidators: true }
    );
    if (!updated) {
      return response.status(404).json({ 
        success: false, 
        message: "Coupon not found",

      });
    }

    response.status(200).json({ 
      success: true, 
      message: "Coupon updated", 
      coupon: updated 
    });
  } catch (error) {
    response.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Delete Coupon
export const deleteCoupon = async (request, response) => {
  try {
    //get coupon id
    const { id } = request.params;
    //deleted coupon
    const deleted = await Coupon.findByIdAndDelete(id);

    if (!deleted) return response.status(404).json({ 
      success: false, 
      message: "Coupon not found" ,
    error:true,
  });

    response.status(200).json({ 
      success: true, 
      message: "Coupon deleted" 
    });
  } catch (error) {
    response.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Apply Coupon
export const applyDiscount = async (request, response) => {
  try {
    //get coupon code
    const { couponCode } = request.body;
    //get user it
    const userId = request.userId;

    //Find Coupon from data base
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
    if (!coupon) {
      return response.status(400).json({ 
        success: false, 
        message: "Invalid or expired coupon" ,
      error:true,
    });
    }

    // Check Expiry
    if (coupon.expiryDate < new Date()) {
      return response.status(400).json({
         success: false, 
         message: "Coupon expired" ,
         error:true,
        });
    }

    // Get Cart Items
    const cartItems = await CartProduct.find({ userId }).populate("productId", "price");
    if (!cartItems.length) {
      return response.status(400).json({ 
        success: false, 
        message: "Cart is empty" ,
        error:true
      });
    }

    //Calculate Total
    const subTotal = cartItems.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);
    const discountAmount = (subTotal * coupon.discountPercent) / 100;
    const total = subTotal - discountAmount;

    // Track coupon usage
    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      return response.status(400).json({ 
        success: false, 
        message: "Coupon usage limit reached",
        error:false
       });
    }
    coupon.usedCount += 1;

    //save data base
    await coupon.save();

    response.json({
      success: true,
      message: "Coupon applied successfully",
      discountAmount,
      total,
    });
  } catch (error) {
    response.status(500).json({ 
      success: false, 
      message: "Error applying coupon", 
      error: err.message 
    });
  }
};