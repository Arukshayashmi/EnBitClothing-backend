import express from "express";
import { addProductDetailsController, uploadProductPictureController, getAllGuestProductController, likeOrUnlikeProductController, deleteProductController, getAllProductController, getSingleProductController } from "../controllers/productController.js";
import { singlUpload } from "../middlewares/multer.js";
import { isAuthentic } from "../middlewares/authMiddleware.js";

const router = express.Router()

//Get All products
router.get('/get-all',isAuthentic, getAllProductController)

//Get Guest All products
router.get('/get-all-guest', getAllGuestProductController)

//Get Single product
router.get('/:id', getSingleProductController)

// product image upload
router.put('/upload-picture',singlUpload, isAuthentic, uploadProductPictureController);

// add product details
router.post('/add-details',isAuthentic, addProductDetailsController);

//delete product
router.delete('/delete/:id', isAuthentic, deleteProductController)

// like or unlike product
router.put('/:productId/like',isAuthentic, likeOrUnlikeProductController);


export default router