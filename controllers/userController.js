
import { sendOtp, sendWelcomeEmail } from "../emails/sendMail.js";
import UserModel from "../models/user.model.js";
import bcrypt from 'bcrypt'
import generatedOtp from "../util/genarateOtp.js";
import uploadImageCloudinary from "../util/uploadImageCloudinary.js";
import generateRefreshToken from "../util/generatedRefreshToken.js";
import generatedAccesToken from "../util/generatedAccessToken.js";



//register user
export const registerUsers=async(requset,response)=>{
    try{
       const{name,email,password} =requset.body;
       if(!name||!email||!password){
        return response.status(400).json({
            message:'All field are required',
            error:true,
            success:false
        })
       }

       //email unique check
       const existingUser=await UserModel.findOne({email});

       //check email unique
       if(existingUser){
        return response.status(400).json({
            message:'User already exists Use another Email',
            error:true,
            success:false,
        });
       }
       const hashedPassword = await bcrypt.hash(password,16);

       //create payload
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
export const loginUsers =async(requset,response)=>{
    try{

        const{email,password}=requset.body;
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
        const refeshToken =await generateRefreshToken(user._id);

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
                data:{
                  updateUser,
                  accessToken, 
                  refeshToken,
                },
                error:false,
                success:true
            });

    }
    catch(error){
      console.log(error)
        return response.status(500).json({
                message:error.message,
                error:true,
                success:false
            });

    }

}

//logout
export const logoutUsers = async (requset, responsepose) => {
  try {
    const userId = requset.userId;

    //check user id
    if (!userId) {
      return responsepose.status(401).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    // Cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      path: "/", // Important to actually clear the cookie
    };

    // Clear cookies
    responsepose.clearCookie("accessToken", cookieOptions);
    responsepose.clearCookie("refresponsehToken", cookieOptions);

    // Remove refresponseh token from database
    await UserModel.findByIdAndUpdate(userId, { refresponseh_token: null });

    return responsepose.status(200).json({
      message: "User logged out successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("Logout error:", error);
    return responsepose.status(500).json({
      message: "Something went wrong during logout",
      error: true,
      success: false,
    });
  }
};

//update user details
export const updateUsers = async (requset, response) => {
  try {
    const userId = requset.userId;
    const { name, mobile } = requset.body;
    const image = requset.file;
     
    //check user id
    if (!userId) {
      return response.status(401).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    //check user in data base
    const existingUser = await UserModel.findById(userId);
    if (!existingUser) {
      return response.status(404).json({
        message: "User not found ",
        error: true,
        success: false,
      });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (mobile) updateData.mobile = mobile;

    if (image) {
      // Remove old avatar if exists
      if (existingUser.avatar) {
        const publicId = existingUser.avatar.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }

      // Upload new avatar
      const upload = await uploadImageCloudinary(image);
      updateData.avatar = upload.secure_url;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password -refresponseh_token");

    return response.status(200).json({
      message: "User updated successfully",
      data: updatedUser,
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Update user error:", error);
    return response.status(500).json({
      message: "Something went wrong during update",
      error: true,
      success: false,
    });
  }
};

// delete user account
export const deleteUser=async(requset,response)=>{
    try {
        const userId=requset.userId;
        

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
            return response.status(404).json({
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

    response.clearCookie("accessToken", cookieOptions);
    response.clearCookie("refresponsehToken", cookieOptions);

     return response.status(200).json({
      message: "User account deleted successfully",
      data: deleteduser, 
      error: false,
      success: true,
    });
        
    } catch (error) {
        return response.status(500).json({
                message:'Something went wrong during delete acount',
                error:true,
                success:false
            });
        
    }
}

//send otp for forgooten password
export const forgotPassword = async (requset, response) => {
  try {
    const { email } = requset.body;

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
    const otp = generatedOtp();
    //console.log("Generated OTP:", otp);
    

    // OTP valid for 5 minutes
    const otpExpiry = Date.now() + 5 * 60 * 1000;
    sendOtp(user,otp);

    // Update user
    const updateUser = await UserModel.findByIdAndUpdate(user._id, {
      forgot_password_otp: otp,
      forgot_password_expiry: new Date(otpExpiry).toISOString(),
    });

    // Send OTP if update successful
    if (updateUser) {
      //await sendOtp(user, otp); // Make sure to await
      //console.log("✅ OTP email sent successfully!");
    }

    return response.status(200).json({
      message: "Password responseet OTP sent to your email",
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

//verify email adresponses
export const verifyEmail = async (requset, response) => {
  try {
    const { code } = requset.body; 
    //console.log(code);

    //check the code
    if (!code) {
      return response.status(401).json({
        message: "Verification code is missing",
        error: true,
        success: false,
      });
    }

    //check user in in data base
    const user = await UserModel.findById(code);
    if (!user) {
      return response.status(401).json({
        message: "Invalid verification link",
        error: true,
        success: false,
      });
    }
  //console.log(user.verify_email)
  //check the before email verify the
    if (user.verify_email) {
      return response.status(200).json({
        message: "Email already verified",
        error: false,
        success: true,
      });
    }

    user.verify_email = true;
    await user.save();
    

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
export const uploadAvatar = async (requset, response) => {
  try {
    // Get user ID
    const userId = requset.userId;
    if (!userId) {
      return response.status(401).json({
        message: "Unauthorized",
        error: true,
        success: false,
      });
    }

    // Get image from multer
    const image = requset.file;
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
export const verifyForgotPasswordOtp= async (requset,response)=>{
  try {
     
    //get user and password
    const {email,otp}=requset.body;

      //check otp and email exist
    if(!email||!otp){
      return response.status(400).json({
        message:'Provide email and otp',
        error:true,
        success:false,
      })
  }
    //check user
    const user=await UserModel.findOne({email})

    if(!user){
      return response.status(400).json({
        message:'Not found User',
        error:true,
        success:false,
      })
    }

    
    //console.log(otp);
    //console.log(user.forgot_password_otp)

    //check otp expire
    const currentTime=new Date();
    if(user.forgot_password_expiry<currentTime){
      return response.status(400).json({
        message:'Otp expaired',
        error:true,
        success:false,
      })
    }

    //check otp
    if(otp!==user.forgot_password_otp){
      return response.status(400).json({
        message:'Otp invalid',
        error:true,
        success:false,
      })
    }

    //update database
    await UserModel.findByIdAndUpdate(user._id,{
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
export const getAllUsers=async (requset,response)=>{
  try {

    //find all users
    const users=await UserModel.find().select('-password');
    return response.status(200).json({
      message: "Users fetched successfully",
      error: false,
      success: true,
      data: users,
    })

    
  } 
  catch (error) {
    return response.status(500).json({
      message: "Internal server error",
      error: true,
      success: false,
    });
  }
}

//get single user by Email
export const getUserByEmail=async(requset,response)=>{
  try {
    //get search email
    const {email}=requset.body;

    //check email
    if(!email){
       return response.status(400).json({
        message: "Email is required",
        error: true,
        success: false,
      });
    }

    //check user from data base

    const user=await UserModel.findOne({email}).select('-password') //get without password
    if(!user){
      return response.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }
    return response.status(200).json({
      message: "User fetched successfully",
      error: false,
      success: true,
      data: user,
    });
    
  } catch (error) {
    return response.status(500).json({
      message: "Internal server error",
      error: true,
      success: false,
    });
  }
}

//admin can delete user by user email
export const adminDeleteUser=async (requset,response)=>{
  try {

    //check user id
    const { userId } = requset.params;

    if (!userId) {
      return response.status(400).json({
        message: "User ID is required",
        error: true,
        success: false,
      });
    }

    //check user  in data base
    const deletedUser = await UserModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      return response.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      message: "User deleted successfully by admin",
      data: deletedUser,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: "Something went wrong",
      error: true,
      success: false,
    });
  }
}

//responseet password
export const resetPassword = async (requset, response) => {
  try {
    const { email, password } = requset.body;

    // Validate input
    if (!email || !password) {
      return response.status(400).json({
        message: "Email and password are required",
        error: true,
        success: false,
      });
    }

    // Find user
    const user = await UserModel.findOne({ email });
    if (!user) {
      return response.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 16);

    // Update password
    user.password = hashedPassword;
    await user.save();

    return response.status(200).json({
      message: "Password responseet successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message: "Internal Server Error",
      error: true,
      success: false,
    });
  }
};

//user get data
export const getUserData = async (requset, response)=>{
  
    try {
        const userId=requset.userId;
        

        //check user
        if(!userId){
            return response.status(401).json({
            message:"Unauthorized",
            error:true,
            success:false,
        })
        }

        //user from the database
        const user=await UserModel.findById(userId);
        if(!user){
          return response.status(404).json({
            message: "User not found",
            error: true,
            success: false,
          });
        }
        response.status(200).json({ 
          success: true,
          data: user ,
          message:"User data fetched successfully",
        });
    } catch (error) {
        response.status(500).json({ 
          success: false, 
          error:true,
          message: error.message });
    }

}

//google login
export const googleLogin = async (req, res) => {
  try {
    const { access_token } = req.body;

    if (!access_token) {
      return res.status(400).json({
        message: "Access token missing",
        success: false
      });
    }

    
    const googleResponse = await axios.get(
      `https://www.googleapis.com/oauth2/v3/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    );
    console.log(googleResponse.data);

    const { email, name, picture } = googleResponse.data;

    if (!email) {
      return res.status(400).json({
        message: "Google user info missing email",
        success: false
      });
    }

    // 2️⃣ Check if user exists
    let user = await UserModel.findOne({ email });

    // 3️⃣ If not, create new user
    if (!user) {
      user = await UserModel.create({
        name: name || "Google User",
        email,
        avatar: picture,
        password: "GoogleOAuth", 
        provider: "google"
      });
    }

    // 4️⃣ Generate tokens
    const accessToken = generatedAccesToken(user);
    const refreshToken = generatedRefreshToken(user._id);
    console.log("Generated Tokens:", { accessToken });

    // 5️⃣ Store refresh token in cookie
    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000
    });

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      message: "Google Login Successful",
      success: true,
      data: {
        updateUser: user,
        accessToken,
        refreshToken
      }
    });

  } catch (error) {
    console.log("Google Login Error:", error.message);
    return res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};