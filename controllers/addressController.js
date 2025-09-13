import AddressModel from "../models/address.model.js";

// Create Address
export const createAddress = async (request, response) => {
  try {
    //get user id
    const userId = request.userId;
    //get address data
    const addressData = { ...request.body, userId };

    //save the data base
    const newAddress = await AddressModel.create(addressData);

    // If user sets default, unset other defaults
    if (addressData.default) {
      await AddressModel.updateMany(
        { userId, _id: { $ne: newAddress._id } },
        { default: false }
      );
    }

    return response.status(201).json({ 
      success: true, 
      message: "Address added", 
      data: newAddress 
    });
  } catch (error) {
    return response.status(500).json({ 
      success: false, 
      message: "Error creating address", 
      error 
    });
  }
};

// Get All Addresses for a User
export const getAddresses = async (request, response) => {
  try {
    //get user id
    const userId = request.userId;
    //get all adress from data base
    const addresses = await AddressModel.find({ userId }).sort({ default: -1 });
   // console.log(addresses)
    return response.status(200).json({ 
      success: true, 
      data: addresses 
    });
  } catch (error) {
    console.log(error)
    return response.status(500).json({ 
      success: false, 
      message: "Error fetching addresses", 
      error 
    });
  }
};

// Get Single Address
export const getAddressById = async (request, response) => {
  try {
    //get address id
    const { addressId } = request.params;
    //find adress
    const address = await AddressModel.findById(addressId);
    if (!address) {
      return response.status(404).json({ 
        success: false, 
        message: "Address not found" 
      });}

    return response.status(200).json({ 
      success: true, 
      data: address 
    });
  } catch (error) {
    return response.status(500).json({ 
      success: false, 
      message: "Error fetching address", 
      error 
    });
  }
};

// Update Address
export const updateAddress = async (request, response) => {
  try {
    //find address id
    const { addressId } = request.params;
    //update
    const updated = await AddressModel.findByIdAndUpdate(addressId, request.body, { new: true, runValidators: true });

    // Handle default update
    if (request.body.default && updated) {
      await AddressModel.updateMany(
        { userId: updated.userId, _id: { $ne: updated._id } },
        { default: false }
      );
    }

    return response.status(200).json({ 
      success: true, 
      message: "Address updated", 
      data: updated 
    });
  } catch (error) {
    return response.status(500).json({ 
      success: false, 
      message: "Error updating address", 
      error 
    });
  }
};

// Delete Address
export const deleteAddress = async (request, response) => {
  try {
    //get adress id
    const { addressId } = request.params;
    //delete adress from data base
    const deleted = await AddressModel.findByIdAndDelete(addressId);

    if (!deleted) {
      return response.status(404).json({ 
        success: false, 
        message: "Address not found" 
      });
    p}
    return response.status(200).json({ 
      success: true, 
      message: "Address deleted" 
    });
  } catch (error) {
    return response.status(500).json({ 
      success: false, 
      message: "Error deleting address", 
      error });
  }
};
