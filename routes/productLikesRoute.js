import express from "express";
import { getAllLikedProducts } from "../controllers/productLikesController.js";
import { isAuthentic } from "../middlewares/authMiddleware.js";

const router = express.Router()

router.get('/get', isAuthentic, getAllLikedProducts);

export default router