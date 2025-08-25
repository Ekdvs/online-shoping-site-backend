import express from 'express'
const userRouter = express.Router(); 

import { registerUsers,loginUsers, logoutUsers } from '../controllers/userController.js';
import auth from '../middleweare/auth.js';

//registeruser
userRouter.post('/register',registerUsers);

//login
userRouter.post('/login',loginUsers);

//logout
userRouter.post('/logout',auth,logoutUsers);


export  default userRouter;