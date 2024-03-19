import mongoose from 'mongoose';

const productLikesSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true
    },
    status: {
        type: Number,
        required: true
    }
}, { timestamps: true });

export const productLikesModel = mongoose.model('productLikes', productLikesSchema);
