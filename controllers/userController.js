
import { sendWelcomeEmail } from "../emails/sendMail.js";
import UserModel from "../models/user.model.js";
import bcrypt from 'bcrypt'
import generatedAccesToken from "../util/generatedAccessToken.js";
import generatedRefreshToken from "../util/generatedRefreshToken.js";



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

       // register user into database
        const newUser = await new UserModel(payload).save();
        await sendWelcomeEmail(newUser)
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
            error:ture,
            success:false,
        })

    }


}

//login

export const loginUsers =async(request,responce)=>{
    try{
        const{email,password}=request.body;
        //check email and password empty
        if(!email||!password){
            return responce.status(400).json({
                message:'All Fields are required',
                error:true,
                success:false
            });
        }
        //find user
        const user=await UserModel.findOne({email});
        if(!user){
            return responce.status(400).json({
                message:'User not Registered',
                error:true,
                success:false
            });
        }
        // Check if ACTIVE (only if your schema has "status")
        if(user.status!=='ACTIVE'){
             return responce.status(400).json({
                message:'User is inative',
                error:true,
                success:false
            });
        }
          // Verify password
        const checkpassword= await bcrypt.compare(password,user.password);
        if(!checkpassword){
            return responce.status(400).json({
                message:'Invalid Credentials (Userpassword not correct)',
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
        responce.cookie("accesToken",accessToken,cookieOptions);
        responce.cookie("refreshToken",refeshToken,cookieOptions);
        
        return responce.status(201).json({
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
        return responce.status(500).json({
                message:'Invalid Credentials',
                error:true,
                success:false
            });

    }

}

