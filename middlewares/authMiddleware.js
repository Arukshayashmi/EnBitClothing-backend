import JWT  from "jsonwebtoken"
import { userModel } from "../models/users.js"

export const isAuthentic = async (req, res, next) => {
    const token = req.headers.authorization;

    if(!token){
        return resp.status(401).send({
            success : false,
            message : 'Unauthorized User'
        })
    }

    const decodeData = JWT.verify(token, process.env.JWT_SECRET)
    req.user = await userModel.findById(decodeData._id)
    next()

}