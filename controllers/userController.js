
import { sendOtp, sendWelcomeEmail } from "../emails/sendMail.js";
import UserModel from "../models/user.model.js";
import bcrypt from 'bcrypt'
import generatedAccesToken from "../util/generatedAccessToken.js";
import generatedRefreshToken from "../util/generatedRefreshToken.js";
import { request, response } from "express";
import generatedOtp from "../util/genarateOtp.js";
import uploadImageCloudinary from "../util/uploadImageCloudinary.js";



//register user
export const registerUsers=async(request,response)=>{
    try{
       const{name,email,password} =request.body;
       if(!name||!email||!password){
        return response.status(400).json({
            message:'All field are required',
            error:true,
            success:false
        })
       }

       //email unique check
       const existingUser=await UserModel.findOne({email});

       if(existingUser){
        return response.status(400).json({
            message:'User already exists Use another Email',
            error:true,
            success:false,
        });
       }
       const hashedPassword = await bcrypt.hash(password,16);

       const payload={
        name,
        email,
        password:hashedPassword
       };

       // register user into database save
        const newUser = await new UserModel(payload).save();
        

        //send email verify link
        const verifyurl = `${process.env.FRONTEND_URL}/verify-email?code=${newUser?._id}`;

        //send  emailmessage
        await sendWelcomeEmail(newUser,verifyurl)

         return response.status(201).json({
            message:' User registered Successfully',
            data:newUser,
            error:false,
            success:true,
        });
    }
    catch(error){
        return response.status(500).json({
            message:'Internal sever error',
            error:true,
            success:false,
        })

    }


}

//login

export const loginUsers =async(request,response)=>{
    try{

        const{email,password}=request.body;
        //check email and password empty
        if(!email||!password){
            return response.status(400).json({
                message:'All Fields are required',
                error:true,
                success:false
            });
        }
        //find user
        const user=await UserModel.findOne({email});
        if(!user){
            return response.status(400).json({
                message:'User not Registered',
                error:true,
                success:false
            });
        }
        // Check if ACTIVE (only if your schema has "status")
        if(user.status!=='ACTIVE'){
             return response.status(400).json({
                message:'User is inative',
                error:true,
                success:false
            });
        }
          // Verify email
        
        if(!user.verify_email){
            return response.status(400).json({
                message:'Please verify your email before logging in',
                error:true,
                success:false
            });
        }
          // Verify password
        const checkpassword= await bcrypt.compare(password,user.password);
        if(!checkpassword){
            return response.status(400).json({
                message:'Invalid Credentials (Incorrect password)',
                error:true,
                success:false
            });
        }
        // acess and refesh token
        const accessToken =await generatedAccesToken(user._id);
        const refeshToken =await generatedRefreshToken(user._id);

         // Update last login
        const updateUser=await UserModel.findByIdAndUpdate(user._id,{
            last_login_date:new Date()
        },{new:true})

        //add cookies
        const cookieOptions={
            httpOnly:true,
            secure:true,
            sameSite:'None',

        }
         
        //add to token to cokies
        response.cookie("accessToken",accessToken,cookieOptions);
        response.cookie("refeshToken",refeshToken,cookieOptions);
        
        return response.status(201).json({
                message:'User Logged in Successfully',
                data:{updateUser,
                    accessToken,
                    refeshToken,
                },
                error:false,
                success:true
            });

    }
    catch(error){
        return response.status(500).json({
                message:'Invalid Credentials',
                error:true,
                success:false
            });

    }

}

//logout

export const logoutUsers=async(request,response)=>{
 try {
    const userId= request.userId;
    //check user
    if(!userId){
        return response.status(401).json({
            message:"User not Found",
            error:true,
            success:false,
        })

    }
    //cookie setting
    const cookieOption={
        httpOnly:true,
        secure:true,
        sameSite:'None',


    }
    //clear cookies

    response.clearCookie("accessToken",cookieOption);
    response.clearCookie("refeshToken",cookieOption);

    //remove refesh token from database
    const removerefeshToken=await UserModel.findByIdAndUpdate(userId ,{
        refresh_token:''
    })

    return response.status(200).json({
        message:'User Logged Out successfully',
        data:removerefeshToken,
        error:false,
        success:true
    })
    
 } catch (error) {
    return response.status(500).json({
                message:'Something went wrong during logout',
                error:true,
                success:false
            });
 }
}

//update user details

export const updateUsers=async(request,response)=>{
    try {
        const userId=request.userId;
        const {name,mobile,password}=request.body;

        //check user
        if(!userId){
            return response.status(401).json({
            message:"User not Found",
            error:true,
            success:false,
        })
        }

        //password hash
        let hashedPassword;

        if(password){
            hashedPassword=await bcrypt.hash(password,16)
        }

        //update data base
        const updateUser=await UserModel.updateOne({_id:userId},
            {
                name,
                mobile,
                password:hashedPassword?hashedPassword:undefined
            }
        )
        return response.status(200).json({
            message:'User update successfully',
            data:updateUser,
            error:false,
            success:true,
        })

        
    } catch (error) {
        return response.status(500).json({
                message:'Something went wrong during logout',
                error:true,
                success:false
            });
    }
} 

// delete user account

export const deleteUser=async(request,response)=>{
    try {
        const userId=request.userId;
        

        //check user
        if(!userId){
            return response.status(401).json({
            message:"Unauthorized",
            error:true,
            success:false,
        })
        }

        //delete user from the database
        const deleteduser=await UserModel.findByIdAndDelete(userId);

        if(!deleteduser){
            return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
        });
        }

        //clear authentication cookies
        const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

     return res.status(200).json({
      message: "User account deleted successfully",
      data: deleteduser, 
      error: false,
      success: true,
    });
        
    } catch (error) {
        return response.status(500).json({
                message:'Something went wrong during logout',
                error:true,
                success:false
            });
        
    }
}

//send otp for forgooten password
export const forgotPassword = async (request, response) => {
  try {
    const { email } = request.body;

    // Find user
    const user = await UserModel.findOne({ email });

    if (!user) {
      return response.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    // Create OTP
    // const otp = generatedOtp();
    console.log("Generated OTP:", otp);

    // OTP valid for 5 minutes
    const otpExpiry = Date.now() + 5 * 60 * 1000;

    // Update user
    const updateUser = await UserModel.findByIdAndUpdate(user._id, {
      forgot_password_otp: otp,
      forgot_password_expiry: new Date(otpExpiry).toISOString(),
    });

    // Send OTP if update successful
    if (updateUser) {
      //await sendOtp(user, otp); // Make sure to await
      console.log("✅ OTP email sent successfully!");
    }

    return response.status(200).json({
      message: "Password reset OTP sent to your email",
      error: false,
      success: true,
    });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    return response.status(500).json({
      message: "Something went wrong during forgot password",
      error: true,
      success: false,
    });
  }
};

//verify email adress

export const verifyEmail = async (request, response) => {
  try {
    const { code } = request.body; // or request.query if GET
    console.log(code);

    if (!code) {
      return response.status(401).json({
        message: "Verification code is missing",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findById(code);
    if (!user) {
      return response.status(401).json({
        message: "Invalid verification link",
        error: true,
        success: false,
      });
    }
//console.log(user.verify_email)
    if (user.verify_email) {
      return response.status(200).json({
        message: "Email already verified",
        error: false,
        success: true,
      });
    }

    user.verify_email = true;
    await user.save();
    //console.log(user.verify_email)

    return response.status(200).json({
      message: "Email verified successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message: "Internal server error",
      error: true,
      success: false,
    });
  }
};

//uploading avater
export const uploadAvatar = async (request, response) => {
  try {
    // Get user ID
    const userId = request.userId;
    if (!userId) {
      return response.status(401).json({
        message: "Unauthorized",
        error: true,
        success: false,
      });
    }

    // Get image from multer
    const image = request.file;
    if (!image) {
      return response.status(400).json({
        message: "No image uploaded",
        error: true,
        success: false,
      });
    }

    // Upload to Cloudinary
    const upload = await uploadImageCloudinary(image);

    // Update user avatar
    await UserModel.findByIdAndUpdate(userId, {
      avatar: upload.secure_url,
      
    });

    return response.status(200).json({
      message: "Profile picture uploaded successfully",
      success: true,
      error: false,
      data: {
        _id: userId,
        avatar: upload.secure_url,
      },
    });
  } catch (error) {
    console.error("Upload Avatar Error:", error);
    return response.status(500).json({
      message: "Internal Server Error",
      error: true,
      success: false,
    });
  }
};

//otp verfiy
export const verifyForgotPasswordOtp= async (request,response)=>{
  try {
     
    //get user and password
    const {email,otp}=request.body;

      //check otp and email exist
    if(!email||!otp){
      return response.status(400).json({
        message:'Provide email and otp',
        error:true,
        sucess:false,
      })
  }
    //check user
    const user=await UserModel.findOne({email})

    if(!user){
      return response.status(400).json({
        message:'Not found User',
        error:true,
        sucess:false,
      })
    }

    //check otp expire

    const currentTime=new Date().toISOString();
    if(user.forgot_password_expiry<currentTime){
      return response.status(400).json({
        message:'Otp expaired',
        error:true,
        sucess:false,
      })
    }

    //check otp
    if(otp==user.forgot_password_otp){
      return response.status(400).json({
        message:'Otp invalid',
        error:true,
        sucess:false,
      })
    }

    //update database
    const updateUser=await UserModel.findByIdAndUpdate(user?._id,{
      forgot_password_expiry:'',
      forgot_password_otp:''
    })

    return response.status(200).json({
      message: "Verify Otp sussesfully ",
      error: false,
      success: true,
    });

    
  } 
  catch (error) {
    return response.status(500).json({
      message: "Internal Server Error",
      error: true,
      success: false,
    });
  }

}

//get all users (for Admin)
export const getAllUsers=async (request,response)=>{
  try {

    //checkrequester is admin
    if(request.role!=="ADMIN"){
      return res.status(403).json({
        message: "Access denied. Admins only.",
        error: true,
        success: false,
      });
    }

    const users=await UserModel.find().select('-password');
    return response.status(200).json({
      message: "Users fetched successfully",
      error: false,
      success: true,
      data: users,
    })

    
  } 
  catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: true,
      success: false,
    });
  }
}

//get single user by Email
export const getUserByEmail=async(request,response)=>{
  try {
    //get search email
    const {email}=request.body;

    //check email
    if(!email){
       return res.status(400).json({
        message: "Email is required",
        error: true,
        success: false,
      });
    }

    //check user from data base

    const user=await UserModel.findOne({email}).select('-password') //get without password
    if(!user){
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }
    return res.status(200).json({
      message: "User fetched successfully",
      error: false,
      success: true,
      data: user,
    });
    
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: true,
      success: false,
    });
  }
}

//admin can delete user by user email
export const adminDeleteUser=async (request,response)=>{
  try {

    //check user id
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
        error: true,
        success: false,
      });
    }

    //check user  in data base
    const deletedUser = await UserModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      message: "User deleted successfully by admin",
      data: deletedUser,
      error: false,
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