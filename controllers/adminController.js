
import UserModel from "../models/user.model.js";
import { sendPromotional } from "../emails/sendMail.js";
import Order from "../models/order.modal.js";

//get user statistics
export const getUserStatistics = async (request, response) => {
  try {
    const totalUsers = await UserModel.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmt" } } }
    ]);

    response.json({
      message: "Admin stats fetched",
      data: {
        totalUsers,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0
      },
      success: true
    });
  } catch (err) {
    response.status(500).json({
         message: "Error fetching stats", 
         error: err.message 
        });
  }
};

//makerting message
export const sendPromotionalEmail=async(request,response)=>{
    try { 
        const { subject, message } = request.body;
    const users = await UserModel.find({}, "email");
    const emailList = users.map(user => user.email);

    if(!emailList){
      return response.status(404).json({
      message:'users emails not found',
      error:true,
      success:false,
    })
    }
        
    sendPromotional(emailList,subject, message)
    return response.status(200).json({
      message:'message send',
      error:false,
      success:true
    })
    } catch (error) {
        response.status(500).json({
         message: "Error fetching stats", 
         error: error.message 
        });
    }
}
