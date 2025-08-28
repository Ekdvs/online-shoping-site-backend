import jwt from "jsonwebtoken";
import UserModel from "../models/user.model";

const auth = async (req, res, next) => {
  try {
    // Get token from cookies or Authorization header
    const token = req.cookies?.accessToken ||
                  (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    if (!token) {
      return res.status(401).json({
        message: "No token provided. Unauthorized",
        error: true,
        success: false,
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);

    if (!decoded) {
      return res.status(401).json({
        message: "Invalid token. Unauthorized",
        error: true,
        success: false,
      });
    }
    // Find user in DB
    const user = await UserModel.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    // Attach user to request
    req.user = user;
    req.userId = decoded.id;
    next();

  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({
      message: "Invalid or expired token",
      error: true,
      success: false,
    });
  }
};

export default auth;
