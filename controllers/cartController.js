import { request, response } from "express";
import CartProduct from "../models/cartProduct.model.js";
import Product from "../models/product.model.js";


//add product to cart
export const createCardItem=async(request,response)=>{
    try {

        //get data
        const{productId,quantity}=request.body;
        const userId=request.userId
        
        //check user id
        if(!userId){
            return response.status(404).json({
                message: "Please login",
                error:true,
                success:false
            })
        }
        

        //check the products
        const product=await Product.findById(productId);
        if(!product){
            return response.status(404).json({
                message:"Product Not Found",
                error:true,
                success:false
            })
        }

        //check product alreday in cart
        let cartItem=await CartProduct.findById(productId);

        if(cartItem){
            cartItem.quantity+=quantity

        }
        else{
            cartItem=await CartProduct.create({
                productId,
                quantity,
                userId,


            })
        }

        return response.status(201).json({
            message: 'product add to cart',
            data:cartItem,
            error:false,
            success:true,
        })
        
    } 
    catch (error) {
        return response.status(500).json({ 
            message: "Server error", 
            error: error.message 
        });
    }
}

//get current user cart
export const getUserCart=async(request,response)=>{
    try {
        //get user id
        const userId=request.userId
        
        //check user login and register
        if(!userId){
            return response.status(404).json({
                message: "Please login",
                error:true,
                success:false
            })
        }

        const cart =await CartProduct.find({userId})
        .populate("productId", "name price image stock");


        if(!cart||cart.length===0){
            return response.status(404).json({
                message: "cart item is empty",
                error:true,
                success:false
            })
        }

        return response.status(200).json({
            message: "Cart retrieved successfully",
            data: cart,
            success: true,
            error:false,
        })
    } 
    catch (error) {
        return response.status(500).json({ 
            message: "Server error", 
            error: error.message });
    }
}

//update cart item in quantity
export const updateCartItem=async(request,response)=>{
    try {

        const userId=request.userId
        const {cartItemId}=request.params;
        const {quantity}=request.body;
        
        //check user login and register
        if(!userId){
            return response.status(404).json({
                message: "Please login",
                error:true,
                success:false
            })
        }

        //check cart item
        const updatedCart = await CartProduct.findOneAndUpdate(
      { _id: cartItemId, userId },
      { quantity },
      { new: true, runValidators: true }
    );

    if (!updatedCart) {
      return response.status(404).json({
        message: "Cart item not found",
        error: true,
        success:false
    });
    }

    return response.status(200).json({
      message: "Cart item updated successfully",
      data: updatedCart,
      success: true,
      error:false
    });

        
    } 
    catch (error) {
        return response.status(500).json({ 
            message: "Server error", 
            error: error.message });
    }
}

//delete cart item
export const deleteCartItem=async(request,response)=>{
    try {
        const userId=request.userId
        const {cartItemId}=request.params;
        
        
        //check user login and register
        if(!userId){
            return response.status(404).json({
                message: "Please login",
                error:true,
                success:false
            })
        }

        //delete in data base
        const deletedCart = await CartProduct.findOneAndDelete({
            _id: cartItemId,
            userId,
        });
        if(!deletedCart){
             return response.status(404).json({
                message: "Cart item not found",
                error:true,
                success:false
            })
        }

        return response.status(200).json({
                message: "Cart item deleted successfully",
                error:false,
                success:true
            })

        
    } catch (error) {
        return response.status(500).json({ 
            message: "Server error", 
            error: error.message });
    }
}
