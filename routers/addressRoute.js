import express from "express";
// fixed typo
import { createAddress, deleteAddress, getAddressById, getAddresses, updateAddress } from "../controllers/addressController.js";
import auth from "../middleweare/auth.js";

const addressRouter = express.Router();

// Create address
addressRouter.post('/create', auth, createAddress);

// Get all addresses
addressRouter.get('/get', auth, getAddresses);

// Get address by id
addressRouter.get('/get/:addressId', auth, getAddressById);

// Update address
addressRouter.put('/update/:addressId', auth, updateAddress);

// Delete address
addressRouter.put('/delete/:addressId', auth, deleteAddress);

export default addressRouter;
