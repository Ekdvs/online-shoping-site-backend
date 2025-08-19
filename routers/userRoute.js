import express from 'express'
const userRouter = express.Router(); 

import { registerUsers,loginUsers } from '../controllers/userController.js';

//registeruser
userRouter.post('/register',registerUsers);

//login
userRouter.post('/login',loginUsers);


export  default userRouter;