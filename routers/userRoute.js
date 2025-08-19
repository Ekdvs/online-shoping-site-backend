import express from 'express'
const userRouter = express.Router(); 

import { registerUsers } from '../controllers/userController.js';

//registeruser
userRouter.post('/register',registerUsers);


export  default userRouter;