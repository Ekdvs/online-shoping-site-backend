import { request, response } from "express";
import AddressModel from "../models/address.model.js";

//create Adress
export const createAdress=async(request,response)=>{
    try {
        const userId=request.userId;
        const Address=request.body;

        //check user id
        if (!userId) {
            return res.status(400).json({
                message: "User ID is required",
                error: true,
                success: false,
            });
        }

        //add address
        const newAddress=await AddressModel.create(Address,userId);

        return res.status(201).json({
            message: "Address created successfully",
            data: newAddress,
            success: true,
        });

        
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: true,
            success: false,
        });
    }
}

//get all address of logged in user
export const getAddresses=async(request,response)=>{
    try {
        const userId=request.userId;

        //check user id
        if (!userId) {
            return res.status(400).json({
                message: "User ID is required",
                error: true,
                success: false,
            });
        }

        const addresses=await AddressModel.find({userId})

        return response.status(200).json({
            message: "Addresses retrieved successfully",
            data: addresses,
            success: true,
        });
        
    } 
    catch (error) {
       return res.status(500).json({
            message: "Something went wrong",
            error: true,
            success: false,
        }); 
    }


}

// Get Single Address by ID
export const getAddressById=async(request,response)=>{
    try {
       const userId=request.userId;

        //check user id
        if (!userId) {
            return res.status(400).json({
                message: "User ID is required",
                error: true,
                success: false,
            });
        }

        //get address
        const {addressId}=request.params;

        const address=await AddressModel.findById(addressId);

        if(!address){
            return res.status(400).json({
                message: "Address not found",
                error: true,
                success: false,
            });
        }

        return response.status(200).json({
            message: "Address retrieved successfully",
            data: address,
            success: true,
            error:false,
        })


        
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: true,
            success: false,
        }); 
    }
}

//update adress
export const updateAddress=async(request,response)=>{
    try {

        const userId=request.userId;
        const {addressId}=request.params;

        //check user id
        if (!userId) {
            return res.status(400).json({
                message: "User ID is required",
                error: true,
                success: false,
            });
        }

        const updated=await AddressModel.findByIdAndUpdate(addressId,request.body);

        if(!updated){
             return res.status(400).json({
                message: "adress update fail",
                error: true,
                success: false,
            });
        }

        return response.status(200).json({
                    message: "Address updated successfully",
                    data: updated,
                    success: true,
                    });
        
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: true,
            success: false,
        }); 
    }


}

//delete adress
export const deleteAddress=async(request,response)=>{
    try {
        const userId=request.userId;
        const {addressId}=request.params;

        //check user id
        if (!userId) {
            return res.status(400).json({
                message: "User ID is required",
                error: true,
                success: false,
            });
        }

        //delete from data base
        const deleted=await AddressModel.findByIdAndDelete(addressId)
        if(!deleted){
            return res.status(400).json({
                message: "Address not found",
                error: true,
                success: false,
            });
        }

        return response.status(200).json({
                    message: "Address deleted successfully",
                    success: true,
                    });
    } 
    catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: true,
            success: false,
        }); 
    }
}