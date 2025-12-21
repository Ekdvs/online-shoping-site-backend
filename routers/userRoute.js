import express from 'express'
const userRouter = express.Router(); 

import { registerUsers,loginUsers, logoutUsers, deleteUser, forgotPassword, verifyEmail, uploadAvatar, getAllUsers, adminDeleteUser, getUserByEmail, verifyForgotPasswordOtp, resetPassword, getUserData, updateUsers, googleLogin } from '../controllers/userController.js';
import auth from '../middleweare/auth.js';
import upload from '../middleweare/multer.js';
import admin from '../middleweare/admin.js';

//registeruser
userRouter.post('/register',registerUsers);

//login
userRouter.post('/login',loginUsers);

//logout
userRouter.post('/logout',auth,logoutUsers);

//update user
userRouter.put("/update-user", auth, upload.single("avatar"), updateUsers);

//delete user account
userRouter.delete('/delete',auth,deleteUser);

//send otp for forgotten password
userRouter.post('/forgot-password',forgotPassword);

//verfiy user email 
userRouter.post('/verify-email',verifyEmail)

//uploade profile picture
userRouter.put('/upload-avatar',auth,upload.single('avatar'), uploadAvatar)

//admin get all users by admin
userRouter.get('/allusers',auth,admin,getAllUsers)

// get user by email
userRouter.get("/email/:email", auth,admin,getUserByEmail);

// Admin deletes any user
userRouter.delete('/delete/:userId',auth,admin,adminDeleteUser);

//check otp
userRouter.post('/verify-forgot-otp',verifyForgotPasswordOtp);

//password change 
userRouter.post('/reset-password', resetPassword);

//get user data
userRouter.get('/me',auth,getUserData );

//password change  when login
userRouter.post('/login-reset-password', auth, resetPassword);

//user google login
userRouter.post('/google-login',googleLogin);

export  default userRouter;
