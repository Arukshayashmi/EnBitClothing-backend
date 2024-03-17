import mongoose from "mongoose";

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log(`MongoDb Connected : ${mongoose.connection.host}`)
    } catch (error) {
        console.log(`MongoDb Error : ${error}`)
    }
}

export default connectDb