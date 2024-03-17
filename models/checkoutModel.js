import mongoose from 'mongoose';

const checkoutSchema = new mongoose.Schema({
    checkoutUserId: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    productId: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'Products',
        required: true
    },
    status: {
        type: Number,
        default: 0 
    }
}, { timestamps: true });

export const checkoutModel = mongoose.model('checkout', checkoutSchema)