import  express from "express";
import { profileStepController, resendCode, verifyController, fetchUserProfileController, logOutUserController, loginController, updateUserPasswordController, userController, userProfilePicUpdateController, userProfileUpdateController } from "../controllers/userController.js";
import {isAuthentic} from "../middlewares/authMiddleware.js";
import { singlUpload } from "../middlewares/multer.js";


const router = express.Router()

//Register Route
router.post('/register', userController)

// email verify
router.post('/verify', isAuthentic, verifyController)

// verification resend
router.get('/resend-code', isAuthentic, resendCode)

// profile complete
router.post('/profile-complete', isAuthentic, profileStepController)

//Login Route
router.post('/login', loginController)

//get User Profie
router.get('/profile', isAuthentic, fetchUserProfileController)

//logout
router.get('/logout', isAuthentic, logOutUserController)

//updateProfile
router.put('/profile-update', isAuthentic, userProfileUpdateController)

//update Password
router.put('/password-update', isAuthentic, updateUserPasswordController)

//update profile photo
router.put('/photo-update', isAuthentic, singlUpload, userProfilePicUpdateController)

export default router