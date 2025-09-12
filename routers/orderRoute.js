import express from "express";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrderById,
  getUsersOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import auth from "../middleweare/auth.js";
import admin from "../middleweare/admin.js";

const orderRouter = express.Router();

// create order
orderRouter.post("/create", auth, createOrder);

// get user orders
orderRouter.get("/getuser", auth, getUsersOrders);

// get all orders (admin)
orderRouter.get("/getall", auth, admin, getAllOrders);

// update order (this was missing)
orderRouter.put("/update/:orderId", auth, updateOrderStatus);

// delete order
orderRouter.delete("/:orderId", auth, deleteOrder);

// get order by id
orderRouter.get("/:orderId",auth, getOrderById);

export default orderRouter;
