import express from "express";
import auth from "../middleweare/auth.js";
import { createCardItem, deleteCartItem, getUserCart, updateCartItem } from "../controllers/cartController.js";


const cartRouter=express.Router();

//create cart item
cartRouter.post("/createcart",auth,createCardItem);

//get all cart item
cartRouter.get("/getcart",auth,getUserCart);

//update cart
cartRouter.put('/updatecart/:cartItemId',auth,updateCartItem);

//delete cart item
cartRouter.delete('/deletecart/:cartItemId',auth,deleteCartItem);

export default cartRouter;
