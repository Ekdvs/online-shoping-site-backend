import UserModel from "../models/user.model.js";

const admin = async (req, res, next) => {
  try {
    // Get userId set by auth middleware
    const userId = req.userId;

    // Find user in DB
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized: User not found",
        error: true,
        success: false,
      });
    }

    // Check admin role
    if (user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Access denied: Admins only",
        error: true,
        success: false,
      });
    }

    // User is admin
    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      success: false,
    });
  }
};

export default admin;
