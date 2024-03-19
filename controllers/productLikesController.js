import { productLikesModel } from "../models/productLikesModel.js";
import { userModel } from "../models/users.js"
import { productModel } from "../models/productModel.js"
import { getDataUri } from "../utils/features.js";
import cloudinary from "cloudinary"

export const getAllLikedProducts = async (req, res) => {
    console.log("Kavindu")
    try {
        const user = await userModel.findById(req.user._id)
        const userId = user._id
        console.log(userId)
        const likedProducts = await productLikesModel.find({ user: userId, status: 1 }).populate('product');

        res.status(200).send({
            success: true,
            message: 'All products liked by user fetched successfully',
            totalLikedProducts: likedProducts.length,
            likedProducts
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