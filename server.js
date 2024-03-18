import express from "express";
import cors from "cors"
import dotenv from "dotenv"
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import cloudinary from 'cloudinary'


//env config
dotenv.config()

//database Connection
connectDb();

//cloudinary config
cloudinary.v2.config({
    api_secret : process.env.CLOUDINARY_SECRET,
    api_key : process.env.CLOUDINARY_API_KEY,
    cloud_name : process.env.CLOUDINARY_NAME,
})

//rest objext
const app = express()

//middlewares
app.use(express.json())
app.use(cors())
app.use(cookieParser())


//routes import
import testRouter from './routes/testRoute.js'
import userRoute from './routes/userRoute.js'
import productRoute from './routes/productRoute.js'
import checkoutRoute from './routes/checkoutRoute.js'
import categoryRoute from './routes/categoryRoute.js'

//routes
app.use('/api/v1', testRouter)
app.use('/api/v1/user', userRoute)
app.use('/api/v1/product', productRoute)
app.use('/api/v1/checkout', checkoutRoute)
app.use('/api/v1/category', categoryRoute)

app.get('/', (req, resp) => {
    return resp.status(200).send("<h1>Welcom to server</h1>")
})

//port
const PORT = process.env.PORT || 8000;

//listen
app.listen(PORT, () => {
    console.log(`Server is Running on Port ${process.env.PORT} on ${process.env.NODE_ENV} mode `)
})