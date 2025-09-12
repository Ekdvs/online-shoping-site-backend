import express from "express";
import auth from "../middleweare/auth.js";
import { createCardItem, deleteCartItem, getUserCart, updateCartItem } from "../controllers/cartController.js";


const cartRouter=express.Router();

//create cart item
cartRouter.post("/create",auth,createCardItem);

//get all cart item
cartRouter.get("/get",auth,getUserCart);

//update cart
cartRouter.put('/update/:cartItemId',auth,updateCartItem);

//delete cart item
cartRouter.delete('/delete/:cartItemId', auth, deleteCartItem);

export default cartRouter;
