import express from "express";
import { isAuthentic } from "../middlewares/authMiddleware.js";
import { createCategoryController, getAllCategoryController } from "../controllers/categoryController.js";

const router = express.Router()

//Create Category
router.post('/create', isAuthentic, createCategoryController)

//get all category
router.get('/get-all', getAllCategoryController)


export default router