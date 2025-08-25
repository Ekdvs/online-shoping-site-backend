import express from 'express'
import { createCategory } from '../controllers/categoryController';
const categoryRouter = express.Router(); 

//create category
categoryRouter.post('/create',createCategory);


export default categoryRouter;