import { productLikesModel } from "../models/productLikesModel.js";
import { userModel } from "../models/users.js"
import { productModel } from "../models/productModel.js"
import { getDataUri } from "../utils/features.js";
import cloudinary from "cloudinary"

export const getAllLikedProducts = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id);
        const userId = user._id;
        
        const likedProducts = await productLikesModel.find({ user: userId, status: 1 }).populate('product');
        
        const likedProductIds = likedProducts.map(likedProduct => likedProduct.product._id.toString());
        
        const allProducts = await productModel.find();
        
        const productsWithFavouriteStatus = allProducts.map(product => {
            const isFavourite = likedProductIds.includes(product._id.toString());
            return { ...product.toObject(), isFavourite }; 
        });

        const filteredProducts = productsWithFavouriteStatus.filter(product => product.isFavourite);
        
        res.status(200).send({
            success: true,
            message: 'All products liked by user fetched successfully',
            totalLikedProducts: filteredProducts.length,
            likedProducts: filteredProducts
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error fetching liked products',
            error
        });
    }
};
