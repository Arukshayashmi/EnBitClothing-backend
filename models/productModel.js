import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        require : [true, "Product Name is require"]
    },
    description:{
        type:String,
        require:[true, "Product description is require"]
    },
    price:{
        type:Number,
        require:[true, 'Product price is require']
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required:[true, 'Product category is required']
    },
    images: {
        public_id : {
            type : String
        },
        url : {
            type : String
        }
    }
}, {timestamps:true} )

export const productModel = mongoose.model("products", productSchema)