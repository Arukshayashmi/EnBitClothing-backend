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
        type: String,
        require:[true, 'Product category is require']
    },
    images:[
        {
            public_id:String,
            url:String
        }
    ]
}, {timestamps:true} )

export const productModel = mongoose.model("products", productSchema)