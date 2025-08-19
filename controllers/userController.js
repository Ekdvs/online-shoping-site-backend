
import UserModel from "../models/user.model.js";
import bcrypt from 'bcrypt'
import { sendWelcomeMail } from "../emails/sendMail.js";

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
        await sendWelcomeMail(newUser)
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

