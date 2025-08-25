import express from 'express'
const userRouter = express.Router(); 

import { registerUsers,loginUsers, logoutUsers, updateUsers, deleteUser, forgotPassword, verifyEmail } from '../controllers/userController.js';
import auth from '../middleweare/auth.js';

//registeruser
userRouter.post('/register',registerUsers);

//login
userRouter.post('/login',loginUsers);

//logout
userRouter.post('/logout',auth,logoutUsers);

//update user
userRouter.put('/update-user',auth,updateUsers);

//delete user account
userRouter.delete('/delete',auth,deleteUser);

//send otp for forgotten password
userRouter.post('/sendotp',forgotPassword);

//verfiy user email 
userRouter.post('/verify-email',verifyEmail)


export  default userRouter;
