import { productLikesModel } from "../models/productLikesModel.js";
import { userModel } from "../models/users.js"
import { productModel } from "../models/productModel.js"
import { getDataUri } from "../utils/features.js";
import cloudinary from 'cloudinary'

//get all products
export const getAllProductController = async (req, resp) => {
    try {
        const { q, categoryId } = req.query;
        let query = {};

        if (q) {
            const searchPattern = new RegExp(q, 'i');
            query.name = searchPattern;
        }
        if (categoryId) {
            query.category = categoryId;
        }
        
        const products = await productModel.find(query).populate('category', 'category');
        
        const user = await userModel.findById(req.user._id);
        const userId = user._id;
        const likedProducts = await productLikesModel.find({ user: userId, status: 1 });

        const likedProductIds = likedProducts.map(likedProduct => likedProduct.product.toString());

        const productsWithFavouriteStatus = products.map(product => {
            const isFavourite = likedProductIds.includes(product._id.toString());
            return { ...product._doc, isFavourite }; 
        });

        resp.status(200).send({
            success: true,
            message: 'All products fetched successfully',
            totalProducts: products.length,
            products: productsWithFavouriteStatus
        });
    } catch (error) {
        console.log(error);
        resp.status(500).send({
            success: false,
            message: 'getAllProduct API Error',
            error
        });
    }
};

// getall products for guest user
export const getAllGuestProductController = async (req, resp) => {
    try {
        const { q, categoryId } = req.query;
        let query = {};

        if (q) {
            const searchPattern = new RegExp(q, 'i');
            query.name = searchPattern;
        }
        if (categoryId) {
            query.category = categoryId;
        }
        
        const products = await productModel.find(query).populate('category', 'category');
        
        // const user = await userModel.findById(req.user._id);
        // const userId = user._id;
        const likedProducts = await productLikesModel.find({ status: 1 });

        const likedProductIds = likedProducts.map(likedProduct => likedProduct.product.toString());

        const productsWithFavouriteStatus = products.map(product => {
            const isFavourite = likedProductIds.includes(product._id.toString());
            return { ...product._doc, isFavourite }; 
        });

        resp.status(200).send({
            success: true,
            message: 'All products fetched successfully',
            totalProducts: products.length,
            products: productsWithFavouriteStatus
        });
    } catch (error) {
        console.log(error);
        resp.status(500).send({
            success: false,
            message: 'getAllProduct API Error',
            error
        });
    }
};



//get single product
export const getSingleProductController = async (req, resp) => {
    try {
        const product = await productModel.findById(req.params.id).populate('category', 'category');
        
        //validation
        if (!product) {
            return resp.status(404).send({
                success: false,
                message: 'Product Not Found'
            })
        }
        resp.status(200).send({
            success: true,
            message: 'Product Fetched successfully',
            product
        })
    } catch (error) {
        console.log("Kavindu")
        //Cast error || object ID error
        if (error.name === 'CastError') {
            return resp.status(500).send({
                success: false,
                message: 'Invalid Id'
            })
        }
        resp.status(500).send({
            success: false,
            message: 'getSingleProduct API Error',
            error
        })
    }
}


// add product image
export const uploadProductPictureController = async (req, resp) => {
    try {
        const file = getDataUri(req.file)
        // console.log(file)
        if (!file) {
            return resp.status(400).json({ success: false, message: 'Please upload a file' });
        }
        // Upload image to Cloudinary
        const cdb = await cloudinary.v2.uploader.upload(file.content)

        // Return the public ID and URL of the uploaded image
        resp.status(200).json({
            success: true,
            message: 'Product picture uploaded successfully',
            publicId: cdb.public_id,
            imageUrl: cdb.secure_url
        });
    } catch (error) {
        console.error('Error uploading product picture:', error);
        resp.status(500).json({
            success: false,
            message: 'Error uploading product picture',
            error: error.message
        });
    }
};

// // Add Product Details
export const addProductDetailsController = async (req, res) => {
    try {
        const { name, description, price, category, publicId, imageUrl } = req.body;

        // Create a new product document in the database
        const newProduct = await productModel.create({
            name,
            description,
            price,
            category,
            images: {
                public_id: publicId,
                url: imageUrl
            }
        });

        res.status(200).json({
            success: true,
            message: 'Product added successfully',
            product: newProduct
        });
    } catch (error) {
        console.error('Error adding product details:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding product details',
            error: error.message
        });
    }
};

//delete product
export const deleteProductController = async(req, resp) => {
    try {
        const product = await productModel.findById(req.params.id)
        if(!product){
            return resp.status(404).send({
                success : false,
                message : 'Product Not Found'
            })
        }
        for(let index=0; index<product.images.length; index++){
            await cloudinary.v2.uploader.destroy(product.images[index].public_id)
        }
        await product.deleteOne();
        resp.status(200).send({
            success : true,
            message : 'Product deleted successfully'
        })
    } catch (error) {
        if (error.name === 'CastError') {
            return resp.status(500).send({
                success: false,
                message: 'Invalid Id'
            })
        }
        resp.status(500).send({
            success:false,
            message:'deleteProduct API Error',
            error
        })
    }
}

export const likeOrUnlikeProductController = async (req, res) => {
    try {
        const { productId } = req.params;
        const user = await userModel.findById(req.user._id)
        const userId = user._id;

        const existingLike = await productLikesModel.findOne({ user: userId, product: productId });

        if (existingLike) {
            existingLike.status = existingLike.status === 1 ? 0 : 1;
            await existingLike.save();
        } else {
            await productLikesModel.create({
                user: userId,
                product: productId,
                status: 1
            });
        }

        const message = existingLike && existingLike.status === 1 ? 'Product liked successfully' : 'Product unliked successfully';

        return res.status(200).send({
            success: true,
            message
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error toggling product like status',
            error
        });
    }
}

