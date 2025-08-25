import UserModel from "../models/user.model.js";

const admin=async(request,response,next)=>{
    try {
        
        //check user set by auth.js
        const userId=request.body
        const user=await UserModel.findById(userId);

        if(!user){
            return res.status(401).json({
            message: "Unauthorized: User not found",
            error: true,
            success: false,
        });
        }

        //check User role
        if(user.role!=="ADMIN"){
            return res.status(403).json({
            message: "Access denied: Admins only",
            error: true,
            success: false,
      });
        }

        //user is admin
        next();


    } catch (error) {
        console.error("Admin middleware error", error);
        return res.status(500).json({
        message: "Internal server error",
        error: true,
        success: false,
        });
    }

}

export default admin;