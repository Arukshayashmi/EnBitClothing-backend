import express from "express";
import { isAuthentic } from "../middlewares/authMiddleware.js";
import { deleteCheckoutController, checkoutController, paidController, getAllCheckoutProductsController } from "../controllers/checkoutController.js";
import router from "./userRoute.js";

// checkout products
router.post('/checkout-product', isAuthentic, checkoutController);

// paid products
router.put('/paid', isAuthentic, paidController);

// get all checkout products
router.get('/getall', isAuthentic, getAllCheckoutProductsController);

// remove checkout
router.delete('/:checkoutId', isAuthentic, deleteCheckoutController);

export default router