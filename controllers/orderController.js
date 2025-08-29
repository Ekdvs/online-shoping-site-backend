import { request, response } from "express";
import Order from "../models/order.modal.js";




//create a order
export const createOrder=async(request,response)=>{
    try {
        const {userId}=request.userId;
        const { orderId, product_details, payment_id, payment_status, delivery_address, subTotalAmt, totalAmt, invoice_receipt } = request.body;


        //check user id
        if (!userId) {
            return response.status(400).json({
                message: "User ID is required",
                error: true,
                success: false,
            });
        }

        const newOrder = await Order.create({
      userId,
      orderId,
      product_details,
      payment_id,
      payment_status,
      delivery_address,
      subTotalAmt,
      totalAmt,
      invoice_receipt,
    });

    return response.status(201).json({
      message: "Order placed successfully",
      data: newOrder,
      success: true,
       });

    } 
    catch (error) {
        return response.status(500).json({
            message: "Something went wrong",
            error: true,
            success: false,
        }); 
    }
}

//Get All Orders of Logged-in User
export const getUsersOrders=async(request,response)=>{
    try {
        const {userId}=request.userId;
        //check user id
        if (!userId) {
            return response.status(400).json({
                message: "User ID is required",
                error: true,
                success: false,
            });
        }
        
        //find order from database
        const orders=await Order.find(userId).sort({createdAt:-1});
        if(!orders){
            return response.status(404).json({
                 message: "please add order now",
                error: true,
                success: false,
            })
        }

        return response.status(200).json({
            message: "User orders fetched successfully",
            data: orders,
            success: true,
        });

    } catch (error) {
        return response.status(500).json({
            message: "Something went wrong",
            error: true,
            success: false,
        }); 
    }
}

//get all orders for addmin
export const getAllOrders=async(request,response)=>{
    try { 
         const {userId}=request.userId;
        //check user id
        if (!userId) {
            return response.status(400).json({
                message: "User ID is required",
                error: true,
                success: false,
            });
        }

        //get order
        const orders =await Order.find().populate("userId", "name email");
        if(!orders){
            return response.status(404).json({
                 message: "order not find",
                error: true,
                success: false,
            })
        }

        return response.status(200).json({
            message: "All orders fetched successfully",
            data: orders,
            success: true,
        });

        
    } catch (error) {
        return response.status(500).json({
            message: "Something went wrong",
            error: true,
            success: false,
        }); 
    }
}

//get single order by id
export const getOrderById=async(request,response)=>{
    try {
         const {userId}=request.userId;
        //check user id
        if (!userId) {
            return response.status(400).json({
                message: "User ID is required",
                error: true,
                success: false,
            });
        }

        const {orderId}=request.params;
        if (!orderId) {
            return response.status(400).json({
                message: "Order ID is required",
                error: true,
                success: false,
            });
        }

        ///find oder from data base
        const order=await Order.findById(orderId).populate("userId", "name email");
        if (!order) {
            return response.status(400).json({
                message: "Order not found",
                error: true,
                success: false,
            });
        }

        return response.status(200).json({
            message: "Order details fetched successfully",
            data: order,
            success: true,
        });
        
    } 
    catch (error) {
        return response.status(500).json({
            message: "Something went wrong",
            error: true,
            success: false,
        }); 
    }
}

//update order status
export const updateOrderSatus=async(request,response)=>{
    try {
        const {delivery_status}=request.body
        const {userId}=request.userId;
        const {orderId}=request.params;
        //check user id
        if (!userId) {
            return response.status(400).json({
                message: "User ID is required",
                error: true,
                success: false,
            });
        }

        //check order id const {orderId}=request.params;
        if (!orderId) {
            return response.status(400).json({
                message: "Order ID is required",
                error: true,
                success: false,
            });
        }

        //check order from data base
        const updatedOrder = await Order.findByIdAndUpdate(orderId, { delivery_status },{ new: true, runValidators: true });
        if(!updatedOrder){
            return response.status(400).json({
                message: "Order not found",
                error: true,
                success: false,
            });
        }

        return response.status(200).json({
            message: "Order status updated successfully",
            data: updatedOrder,
            success: true,
        });

        
    } catch (error) {
        return response.status(500).json({
            message: "Something went wrong",
            error: true,
            success: false,
        });
    }
}

//delete order or cancel order
export const deleteOrder=async(request,response)=>{
    try {
        
        const {userId}=request.userId;
        const {orderId}=request.params;
        //check user id
        if (!userId) {
            return res.status(400).json({
                message: "User ID is required",
                error: true,
                success: false,
            });
        }

        //check order id const {orderId}=request.params;
        if (!orderId) {
            return res.status(400).json({
                message: "Order ID is required",
                error: true,
                success: false,
            });
        }

        //delete from database
        const deleted = await Order.findByIdAndDelete(orderId);
        if (!deleted) {
            return res.status(400).json({
                message: "Order ID is required",
                error: true,
                success: false,
            });
        }

        return response.status(200).json({ 
            message: "Order deleted successfully", 
            success: true 
        });


        
    }
     catch (error) {
        return response.status(500).json({
            message: "Something went wrong",
            error: true,
            success: false,
        });
    }
}

//get to selling products
export const getTopSellingProucts=async(request,response)=>{
    try {
    const topProducts = await Order.aggregate([
      { $unwind: "$product_details" },
      { $group: { _id: "$product_details.productId", totalSold: { $sum: "$product_details.quantity" } } },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ]);

    response.json({
      message: "Top selling products",
      data: topProducts,
      success: true
    });
  } catch (err) {
    response.status(500).json({ message: "Error fetching analytics", error: err.message });
  }
}

