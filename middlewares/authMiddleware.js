import JWT from "jsonwebtoken";
import { userModel } from "../models/users.js";

export const isAuthentic = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send({
            success: false,
            message: 'Unauthorized User'
        });
    }

    const token = authHeader.split(' ')[1]; 
    
    try {
        const decodeData = JWT.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Data:', decodeData);
        req.user = await userModel.findById(decodeData._id);
        next();
    } catch (error) {
        console.error('Error verifying JWT token:', error);
        return res.status(401).send({
            success: false,
            message: 'Invalid Token'
        });
    }
};
