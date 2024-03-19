import mongoose from 'mongoose';

const productLikesSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products',
        required: true
    },
    status: {
        type: Number,
        required: true
    }
}, { timestamps: true });

export const ProductLikesModel = mongoose.model('ProductLikes', productLikesSchema);
