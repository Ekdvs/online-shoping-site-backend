import Notification from "../models/notification.model.js";
import Order from "../models/order.modal.js";
import UserModel from "../models/user.model.js";
import { emitToAdmin, emitToUser } from "../services/soketService.js";


// Create Order
export const createOrder = async (request, response) => {
  try {
    //get userId
    const userId = request.userId;
    // field data
    const {
      product_details,
      delivery_address,
      subTotalAmt,
      totalAmt,
      payment_status,
      payment_id,
    } = request.body;

    //check all field
    if (
      !product_details ||
      !delivery_address ||
      !subTotalAmt ||
      !totalAmt
    ) {
      return response.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    //create order
    const order = await Order.create({
      userId,
      orderId: `ORD-${Date.now()}`,
      product_details: JSON.stringify(product_details),
      payment_id,
      payment_status: payment_status || "pending",
      delivery_address,
      subTotalAmt,
      totalAmt,
    });

    //create  notification in data base
    const userNote=await Notification.create({
      userId,
      message:`Your order ${order.orderId} has been placed successfully`,
      meta:{orderId:order.orderId},
      role:'user'

    })

    // emit real-time event to the specific user (if connected)
    emitToUser(userId, "notification", userNote);
    
    // Admin notifications
    const admins = await UserModel.find({ role: "ADMIN" }, "_id name");
    

    for (let admin of admins) {
      const adminNote = await Notification.create({
      userId: admin._id,
      message: `New order ${order.orderId} placed by ${request.userName || "a user"}`,
      meta: { orderId: order.orderId, userId },
      role: "admin",
    });

      emitToAdmin("newAdminNotification", adminNote);
      
    }

    return response.status(201).json({
      success: true,
      message: "Order placed",
      data: order,
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      success: false,
      message: "Error creating order",
      error: error.message,
    });
  }
};

//Update Order (status, payment, delivery)
export const updateOrderStatus = async (request, response) => {
  try {

    // get user id order id status
    const userId = request.userId;
    const { orderId } = request.params;
    const { delivery_status, payment_status, payment_id } = request.body;
    

    //check user id
    if (!userId) {
      return response.status(400).json({
        message: "User ID is required",
        success: false,
      });
    }

    if (!orderId) {
      return response.status(400).json({
        message: "Order ID is required",
        success: false,
      });
    }

    //update order status
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { delivery_status, payment_status, payment_id },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return response.status(404).json({
        message: "Order not found",
        success: false,
      });
    }

    // build message
    let noteMessage = `Your order ${updatedOrder.orderId} has been updated.`;
    if (delivery_status) noteMessage = `Your order ${updatedOrder.orderId} is now ${delivery_status}`;
    if (payment_status) noteMessage = `Your order ${updatedOrder.orderId} payment is ${payment_status}`;

    // Notify the user
    const userNote = await Notification.create({
      userId,
      message: noteMessage,
      meta: { orderId: updatedOrder.orderId, delivery_status, payment_status },
      role: "user",
    });
    emitToUser(userId, "notification", userNote);

    // Notify admins about the update
    const admins = await UserModel.find({ role: "ADMIN" }, "_id name");
    

    for (let admin of admins) {
      const adminNote = await Notification.create({
        userId: admin._id,
        message: `Order ${updatedOrder.orderId} updated by admin`,
        meta: { orderId: updatedOrder.orderId, delivery_status, payment_status, userId },
        role: "admin",
      });
      emitToAdmin("newAdminNotification", adminNote);
      
    }

    return response.status(200).json({
      message: "Order updated successfully",
      data: updatedOrder,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
      success: false,
    });
  }
};

//Get all orders of a logged-in user
export const getUsersOrders = async (request, response) => {
  try {
    //get user id
    const userId = request.userId;

    //find oder using user id
    const orders = await Order.find({ userId }).populate("delivery_address").sort({ createdAt: -1 });

    if(!orders){
      return response.status(400).json({
      message: "User orders Not found",
      data: orders,
      success: true,
    });
    }

    return response.status(200).json({
      message: "User orders fetched successfully",
      data: orders,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: "Something went wrong",
      error: error.message,
      success: false,
    });
  }
};

// Get all orders (admin only)
export const getAllOrders = async (request, response) => {
  try {
    //get all oders
    const orders = await Order.find().populate("userId", "name email").populate("delivery_address");
    return response.status(200).json({
      message: "All orders fetched successfully",
      data: orders,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: "Something went wrong",
      error: error.message,
      success: false,
    });
  }
};

// Get single order by custom orderId
export const getOrderById = async (request, response) => {
  try {
    //get order id
    const { orderId } = request.params;
    

    // Find by custom orderId, not _id
    const order = await Order.findOne({ orderId }).populate("userId", "name email").populate("delivery_address");

    if (!order) {
      return response.status(404).json({
        message: "Order not found",
        success: false,
      });
    }

    return response.status(200).json({
      message: "Order details fetched successfully",
      data: order,
      success: true,
    });
  } catch (error) {
    
    return response.status(500).json({
      message: "Something went wrong2",
      error: error.message,
      success: false,
    });
  }
};

//Delete order
export const deleteOrder = async (request, response) => {
  try {
    // order id
    const { orderId } = request.params;
    //delete order
    const deleted = await Order.findByIdAndDelete(orderId);

    if (!deleted) {
      return response.status(404).json({
        message: "Order not found",
        success: false,
      });
    }

    return response.status(200).json({
      message: "Order deleted successfully",
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: "Something went wrong",
      error: error.message,
      success: false,
    });
  }
};
