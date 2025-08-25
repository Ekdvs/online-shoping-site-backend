import express from 'express'
const userRouter = express.Router(); 

import { registerUsers,loginUsers, logoutUsers, updateUsers, deleteUser } from '../controllers/userController.js';
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
userRouter.delete('/delete',deleteUser);


export  default userRouter;
