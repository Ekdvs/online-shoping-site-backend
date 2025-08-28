import express from "express";
import auth from "../middleweare/auth.js";
import { createAdress, deleteAddress, getAddressById, getAddresses, updateAddress } from "../controllers/addressController.js";

const addressRouter=express.Router();

//create address
addressRouter.post('/create',auth,createAdress);
//get address
addressRouter.get('/get',auth,getAddresses);
//get address by id
addressRouter.get('/:addressId',auth,getAddressById);
//update address
addressRouter.put('/update/:addressId',auth,updateAddress);
//delete address
addressRouter.put('/delete/:addressId',auth,deleteAddress);


export default addressRouter;