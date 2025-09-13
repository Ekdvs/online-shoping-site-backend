import Order from "../models/order.modal.js";
import UserModel from "../models/user.model.js";


// Get Admin Dashboard Stats
export const getUserStatistics = async (req, res) => {
  try {
    // Total users & orders
    const totalUsers = await UserModel.countDocuments();
    const totalOrders = await Order.countDocuments();
    
    // Total revenue
    const totalRevenueAgg = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmt" } } }
    ]);
    const totalRevenue = totalRevenueAgg[0]?.total || 0;

    // Daily revenue for last 7 days
    const dailyRevenueAgg = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$totalAmt" },
        },
      },
      { $sort: { "_id": 1 } },
      { $limit: 7 },
    ]);
    const dailyRevenue = dailyRevenueAgg.map(d => ({ date: d._id, revenue: d.revenue }));

    // Payment status breakdown
    const paymentStatusAgg = await Order.aggregate([
      { $group: { _id: "$payment_status", count: { $sum: 1 } } },
    ]);
    const paymentStatus = paymentStatusAgg.map(p => ({ status: p._id, count: p.count }));

    // Daily new users last 7 days
    const dailyUsersAgg = await UserModel.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
      { $limit: 7 },
    ]);
    const dailyUsers = dailyUsersAgg.map(u => ({ date: u._id, count: u.count }));

    // Latest 5 orders
    const latestOrdersRaw = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "name")
      .lean();

    const latestOrders = latestOrdersRaw.map(order => ({
      _id: order._id,
      orderId: order.orderId,
      userName: order.userId?.name || "Unknown",
      totalAmt: order.totalAmt,
      payment_status: order.payment_status,
      delivery_status: order.delivery_status,
    }));

    res.json({
      success: true,
      data: {
        totalUsers,
        totalOrders,
        totalRevenue,
        dailyRevenue,
        paymentStatus,
        dailyUsers,
        latestOrders,
      },
      message: "Admin stats fetched successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching stats", error: err.message });
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
