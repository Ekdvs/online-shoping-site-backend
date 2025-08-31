import express from 'express'
const userRouter = express.Router(); 

import { registerUsers,loginUsers, logoutUsers, updateUsers, deleteUser, forgotPassword, verifyEmail, uploadAvatar, getAllUsers, adminDeleteUser, getUserByEmail } from '../controllers/userController.js';
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
userRouter.put('/update-user',auth,updateUsers);

//delete user account
userRouter.delete('/delete',auth,deleteUser);

//send otp for forgotten password
userRouter.post('/forgot-password',forgotPassword);

//verfiy user email 
userRouter.post('/verify-email',verifyEmail)

//uploade profile picture
userRouter.put('/upload-avatar',auth,upload.single('avatar'), uploadAvatar)

//admin get all users
userRouter.get('/allusers',auth,admin,getAllUsers)

// get user by email
userRouter.get("/email/:email", auth,admin,getUserByEmail);

// Admin deletes any user
userRouter.delete('/delete/:userId',auth,admin,adminDeleteUser);




export  default userRouter;
