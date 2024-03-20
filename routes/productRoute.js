import express from "express";
import { addProductDetailsController, uploadProductPictureController, getAllGuestProductController, likeOrUnlikeProductController, deleteProductController, deleteProductIamgeController, getAllProductController, getSingleProductController, updateProductController, updateProductImageController } from "../controllers/productController.js";
import { singlUpload } from "../middlewares/multer.js";
import { isAuthentic } from "../middlewares/authMiddleware.js";

const router = express.Router()

//Get All products
router.get('/get-all',isAuthentic, getAllProductController)

//Get Guest All products
router.get('/get-all-guest', getAllGuestProductController)

//Get Single product
router.get('/:id', getSingleProductController)

//create New Product
// router.post('/create', singlUpload, isAuthentic, createNewProductController)

// product image upload
router.post('/upload-picture',singlUpload, isAuthentic, uploadProductPictureController);

// add product details
router.post('/add-details',isAuthentic, addProductDetailsController);

//update product
router.put('/:id', isAuthentic, updateProductController)

//update product image
router.put('/image/:id', isAuthentic, singlUpload, updateProductImageController)

//delete product image
router.delete('/delete-image/:id', isAuthentic, deleteProductIamgeController)

//delete product
router.delete('/delete/:id', isAuthentic, deleteProductController)

// like or unlike product
router.put('/:productId/like',isAuthentic, likeOrUnlikeProductController);


export default router