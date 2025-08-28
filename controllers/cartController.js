import { response } from "express";
import CartProduct from "../models/cartProduct.model.js";
import Product from "../models/product.model.js";


//add product to cart
export const createCardItem=async(request,response)=>{
    try {

        //get data
        const{productId,quantity}=request.body;
        const userId=request.userId

        //check the products
        const product=await Product.findById(productId);
        if(!product){
            return response.status(404).json({
                message:"Product Not Found",
                error:true,
                sucess:false
            })
        }

        //check product alreday in cart
        let cartItem=await CartProduct.findById(productId);

        if(cartItem){
            cartItem.quentity+=quantity

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
            sucess:true,
        })
        
    } 
    catch (error) {
        return response.status(500).json({ 
            message: "Server error", 
            error: error.message });
    }
}

//get current user cart
export const getUserCart=async(request,response)=>{
    
}