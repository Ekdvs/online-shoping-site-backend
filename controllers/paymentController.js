import Stripe from "stripe";
import axios from "axios";
import Payment from "../models/payment.modal.js";
import Order from "../models/order.modal.js";
import {  sendPaymentSuccess } from "../emails/sendMail.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create PaymentIntent
export const createPayment = async (request, response) => {
  try {
    const { orderId, amount } = request.body;
    const userId = request.user?._id;

    if (!orderId || !amount || !userId) {
      return response.status(400).json({
        success: false,
        message: "Order ID, amount, and userId are required",
      });
    }

    // Convert LKR to USD
    let amountInUSD;
    try {
      const fxResponse = await axios.get("https://open.er-api.com/v6/latest/LKR");
      const rate = fxResponse.data?.rates?.USD;
      if (!rate) throw new Error("USD conversion rate not found");
      amountInUSD = amount * rate;
    } catch (err) {
      return response.status(502).json({
        success: false,
        message: "Currency conversion failed",
        error: err.message,
      });
    }

    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amountInUSD * 100),
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: { orderId, userId: userId.toString() },
    });

    // Save payment in DB
    const payment = new Payment({
      userId,
      orderId,
      stripePaymentIntentId: paymentIntent.id,
      amount,
      currency: "usd",
      status: "pending",
      receipt_url: "",
      raw: paymentIntent,
    });
    await payment.save();

    response.status(201).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Get Payment Receipt 
export const getPaymentReceipt = async (request, response) => {
  try {
    const payment = await Payment.findOne({ stripePaymentIntentId: request.params.id });
    if (!payment) return response.status(404).json({ success: false, message: "Payment not found" });
    // Fetch the order for email details
    const order = await Order.findById(payment.orderId)
      .populate("userId", "name email")
      .populate("delivery_address");

    if (order?.userId?.email && order?.userId?.name) {
      // Send payment success email
      await sendPaymentSuccess(order, payment);


      console.log("📧 Emails sent to:", order.userId.email);
    }

    response.status(200).json({ 
      success: true, receipt_url: 
      payment.receipt_url, payment 
    });
    

  } catch (err) {
    console.error("Error in getPaymentReceipt:", err.message);
    response.status(500).json({ 
      success: false, message: "Internal Server Error", 
      error: err.message });
  }
};

//Handle Stripe Webhook
export const handleStripeWebhook = async (req, res) => {
  console.log("Raw body:", req.body.toString());
  console.log("Headers:", req.headers);
  res.sendStatus(200);
};

// Get All Payments for a User
export const getUserPayments = async (request, response) => {
  try {
    //get payments   

    const payments = await Payment.find({ userId: request.user._id }).sort({ createdAt: -1 });
    response.status(200).json(payments);
  } catch (error) {
    console.log(error)
    response.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Update Payment (Admin Only)
export const updatePayment = async (request, response) => {
  try {
    const paymentId = request.params.id;
    if (!paymentId) return response.status(400).json({ 
      success: false, 
      message: "Payment ID is required" 
    });

    const payment = await Payment.findByIdAndUpdate(paymentId, request.body, { new: true });
    if (!payment) return response.status(404).json({ 
      success: false, 
      message: "Payment not found" 
    });

    response.status(200).json({ 
      success: true, 
      message: "Payment updated successfully", 
      payment
     });
  } catch (error) {
    response.status(500).json({ 
      success: false,
      message: "Internal Server Error", 
      error: error.message 
    });
  }
};

// Delete Payment (Admin Only)
export const deletePayment = async (request, response) => {
  try {
    const paymentId = request.params.id;
    if (!paymentId) return response.status(400).json({ success: false, message: "Payment ID is required" });

    const payment = await Payment.findByIdAndDelete(paymentId);
    if (!payment) return response.status(404).json({ 
      success: false, 
      message: "Payment not found"
     });

    response.status(200).json({ 
      success: true, 
      message: "Payment deleted successfully" 
    });
  } catch (err) {
    response.status(500).json({ 
      success: false, 
      message: "Internal Server Error", 
      error: err.message 
    });
  }
};

// Get All Payments (Admin Only)
export const getAllPayments = async (request, response) => {
  try {
    const payments = await Payment.find()
      .populate("userId", "name email phone role")
      .sort({ createdAt: -1 });

    response.status(200).json({ 
      success: true, 
      message: "All payments retrieved successfully",
      payments 
    });
  } catch (error) {
    response.status(500).json({ 
      success: false, 
      message: "Internal Server Error", 
      error: error.message 
    });
  }
};




