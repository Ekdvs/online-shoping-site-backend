
import CartProduct from "../models/cartProduct.model.js";
import Coupon from "../models/coupon.model.js";

// 🟢 Admin: Create Coupon
export const createCoupon = async (req, res) => {
  try {
    const { code, discountPercent, expiryDate, description, usageLimit } = req.body;

    const coupon = new Coupon({
      code: code.toUpperCase(),
      discountPercent,
      expiryDate,
      description,
      usageLimit,
    });

    await coupon.save();
    res.status(201).json({ success: true, message: "Coupon created", coupon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🟢 Admin: Get All Coupons
export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json({ success: true, coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🟢 Admin: Update Coupon
export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Coupon.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: "Coupon not found" });

    res.json({ success: true, message: "Coupon updated", coupon: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🟢 Admin: Delete Coupon
export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Coupon.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: "Coupon not found" });

    res.json({ success: true, message: "Coupon deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🟢 User: Apply Coupon
export const applyDiscount = async (req, res) => {
  try {
    const { couponCode } = req.body;
    const userId = req.userId;

    // 1️⃣ Find Coupon
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
    if (!coupon) {
      return res.status(400).json({ success: false, message: "Invalid or expired coupon" });
    }

    // 2️⃣ Check Expiry
    if (coupon.expiryDate < new Date()) {
      return res.status(400).json({ success: false, message: "Coupon expired" });
    }

    // 3️⃣ Get Cart Items
    const cartItems = await CartProduct.find({ userId }).populate("productId", "price");
    if (!cartItems.length) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // 4️⃣ Calculate Total
    const subTotal = cartItems.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);
    const discountAmount = (subTotal * coupon.discountPercent) / 100;
    const total = subTotal - discountAmount;

    // 5️⃣ Optional: Track coupon usage
    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ success: false, message: "Coupon usage limit reached" });
    }
    coupon.usedCount += 1;
    await coupon.save();

    res.json({
      success: true,
      message: "Coupon applied successfully",
      discountAmount,
      total,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error applying coupon", error: err.message });
  }
};