import express from "express";
import { isAuthentic } from "../middlewares/authMiddleware.js";
import { createCategoryController, deleteCategoryController, getAllCategoryController, updateCategoryController } from "../controllers/categoryController.js";

const router = express.Router()

//Create Category
router.post('/create', isAuthentic, createCategoryController)

//get all category
router.get('/get-all', getAllCategoryController)

//delete category
router.delete('/delete/:id', deleteCategoryController)

//update category
router.put('/update/:id', updateCategoryController)


export default router