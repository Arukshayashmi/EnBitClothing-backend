import { checkoutModel } from '../models/checkoutModel.js';
import { userModel } from "../models/users.js"
import { productModel } from '../models/productModel.js';

// product checkout
export const checkoutController = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id)
        const { productId } = req.body;

        await checkoutModel.create({
            checkoutUserId: user._id,
            productId: productId,
            status: 1 
        })
        res.status(200).json({
            success: true,
            message: 'Checkout successful'
        });
    } catch (error) {
        console.error('Error during checkout:', error);
        res.status(500).json({
            success: false,
            message: 'Error during checkout',
            error: error.message
        });
    }
};

// paid product
export const paidController = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = await userModel.findById(req.user._id);

        const checkoutEntry = await checkoutModel.findOne({
            checkoutUserId: user._id,
            productId: productId
        });

        if (checkoutEntry) {
            checkoutEntry.status = 2;
            await checkoutEntry.save();

            res.status(200).json({
                success: true,
                message: 'Product marked as paid successfully'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Checkout entry not found for the specified product ID'
            });
        }
    } catch (error) {
        console.error('Error marking product as paid:', error);
        res.status(500).json({
            success: false,
            message: 'Error marking product as paid',
            error: error.message
        });
    }
};

// get all checkout products
export const getAllCheckoutProductsController = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id);

        const checkoutEntries = await checkoutModel.find({ checkoutUserId: user._id });
        
        const checkoutProducts = [];

        for (const entry of checkoutEntries) {
            const product = await productModel.findById(entry.productId).populate('category','category');
            const productDetails = {
                _id: product._id,
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                images: product.images
            };

            const checkoutProduct = {
                _id: entry._id,
                productDetails: productDetails,
                status: entry.status,
                createdAt: entry.createdAt,
                updatedAt: entry.updatedAt
            };

            checkoutProducts.push(checkoutProduct);
        }
        res.status(200).json({
            success: true,
            message: 'Checkout products retrieved successfully',
            checkoutProducts: checkoutProducts
        });
    } catch (error) {
        console.error('Error retrieving checkout products:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving checkout products',
            error: error.message
        });
    }
};