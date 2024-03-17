import { checkoutModel } from '../models/checkoutModel.js';

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
