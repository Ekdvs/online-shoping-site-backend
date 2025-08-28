import express from "express";
import { createOrder, deleteOrder, getAllOrders, getOrderById, getTopSellingProucts, getUsersOrders, updateOrderSatus } from "../controllers/orderController.js";
import auth from "../middleweare/auth.js";
import admin from "../middleweare/admin.js";


const orderRouter=express.Router();

//create order
orderRouter.post('/create',auth,createOrder)
//get user all orders
orderRouter.get('/getuser',auth,getUsersOrders);
//get all users from admin
orderRouter.put('/orders',auth,admin,getAllOrders);
//get order by orderid
orderRouter.get('/:orderId',auth,getOrderById);
//update order status
orderRouter.put('/:orderId',auth,updateOrderSatus);
//delete or cancel order
orderRouter.delete('/:orderId',auth,deleteOrder);
//best selling
orderRouter.get('/top-selling',auth,admin,getTopSellingProucts)


export default orderRouter;