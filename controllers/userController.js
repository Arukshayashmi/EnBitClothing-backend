import { userModel } from "../models/users.js"
import { getDataUri } from "../utils/features.js"
import cloudinary from 'cloudinary'
import nodemailer from 'nodemailer'

export const userController = async (req, resp) => {
    try {
        const { email, password } = req.body

        if (!email || !password ) {
            resp.status(500).send({
                success: false,
                message: 'Please provide all fields',
            })
        }

        //check email existance
        const emailExist = await userModel.findOne({ email })
        if (emailExist) {
            return resp.status(500).send({
                success: false,
                message: 'Email Already Exist'
            })
        }

        const confirmation_code = Math.floor(1000 + Math.random() * 9000);

        const user = await userModel.create({
            email,
            password,
            confirmation_code: confirmation_code
        })
        
        await sendVerificationEmail(email, confirmation_code);

        const token = user.tokenGenerate()

        resp.status(200).cookie('token', token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            httpOnly : process.env.NODE_ENV === 'development' ? true : false,
            secure : process.env.NODE_ENV === 'development' ? true : false,
        }).send({
            success: true,
            message: 'Registration successfull',
            token,
            user
        })
    } catch (error) {
        console.log(error)
        resp.status(500).send({
            success: false,
            message: 'Error in Register API',
            error
        })
    }
}

// resend code
export const resendCode = async(req, res) => {
    try {
        const user = await userModel.findById(req.user._id)
        const confirmation_code = Math.floor(1000 + Math.random() * 9000);
        await userModel.findByIdAndUpdate(user._id, { 
            confirmation_code : confirmation_code
        });

        await sendVerificationEmail(user.email, confirmation_code);

        res.status(200).send({ 
            success: true, 
            message: 'verification code resend successfully', 
            user 
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in Register API',
            error
        })
    }
}
// verify email
export const verifyController = async (req, resp) => {
    try {

        const user = await userModel.findById(req.user._id)

        const { code } = req.body;
        // Check if confirmation code matches
        if (user.confirmation_code === code) {
            await userModel.findByIdAndUpdate(user._id, { email_verify_at: new Date() });
        } else {
            return resp.status(400).send({ success: false, message: 'Invalid verification code, Resend and try again' });
        }

        console.log('veriffied');
        // Send success response
        resp.status(200).send({ 
            success: true, 
            message: 'Email verified successfully', 
            user 
        });
    } catch (error) {
        // Send error response
        console.error('Error verifying email:', error);
        resp.status(500).send({ 
            success: false, 
            message: 'Error verifying email', 
            error });
    }
}

export const profileStepController = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id)
        const { first_name, last_name, adress, city, post_code, phone, dob } = req.body;

        await userModel.findByIdAndUpdate(user._id, { 
            first_name ,
            last_name,
            adress,
            city,
            post_code,
            phone,
            dob
        });
        res.status(200).send({
            success: true,
            message: 'Profile Step update',
            user
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error comple profile',
            error
        })
    }
}

//Login Controller

export const loginController = async (req, resp) => {
    try {
        const { email, password } = req.body;

        //validation
        if (!email || !password) {
            return resp.status(500).send({
                success: false,
                message: 'Please enter both Email and Password'
            })
        }
        //exatract user
        const user = await userModel.findOne({ email })

        //verify email
        if (!user) {
            return resp.status(404).send({
                success: false,
                message: 'User Not Found'
            })
        }

        //compare password with encrypted
        const validPass = await user.comparePassword(password)

        //verfiy Password
        if (!validPass) {
            return resp.status(401).send({
                success: false,
                message: 'Invalid Cridentals'
            })
        }

        //token genererated
        const token = user.tokenGenerate()

        resp.status(200).cookie('token', token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            httpOnly : process.env.NODE_ENV === 'development' ? true : false,
            secure : process.env.NODE_ENV === 'development' ? true : false,
        }).send({
            success: true,
            message: 'Login Successfully',
            token,
            user
        })

    } catch (error) {
        resp.status(500).send({
            success: false,
            message: 'Login API Error',
            error
        })
    }
}


//fetch user Profile COntroller

export const fetchUserProfileController = async (req, resp) => {
    try {
        const user = await userModel.findById(req.user._id)
        user.password = undefined
        resp.status(200).send({
            success : true,
            message : "User Data fetched successfully",
            user
        })
    } catch (error) {
        console.log(error)
        resp.status(500).send({
            success : false,
            message : "Error in fetchProfile API",
            error
        })
    }
}


// logOut User Controller
export const logOutUserController = (req, resp) => {
    try {
        resp.status(200).cookie('token', '', {
            expires : new Date(Date.now()),
            secure : process.env.NODE_ENV === 'development' ? true : false,
            httpOnly : process.env.NODE_ENV === 'development' ? true : false,
        }).send({
            success : true,
            message : 'Logged Out Successfully'
        })
    } catch (error) {
        console.log(error)
        resp.send({
            success : false,
            message : 'Error in LogOut API',
            error
        })
    }
}


//update User Proile
export const userProfileUpdateController = async (req, resp) => {
    try {
        const user = await userModel.findById(req.user._id)
        const {name, email, phone, adress, city, country} = req.body
        //validation + update
        if(name) user.name = name
        if(email) user.name = email
        if(phone) user.phone = phone
        if(adress) user.adress = adress
        if(city) user.city = city
        if(country) user.country = country

        await user.save();
        resp.status(200).send({
            success : true,
            message : 'UserProfile Updated Successfully'
        })

    } catch (error) {
        resp.status(500).send({
            success : false,
            message : 'updateProfile API Error',
            error
        })
    }
}


//update Password
export const updateUserPasswordController = async (req, resp) => {
    try {
        const user = await userModel.findById(req.user._id)
        const {oldPassword, newPassword} = req.body
        //validation
        if(!oldPassword || !newPassword){
            return resp.status(500).send({
                success : false,
                message : 'Please provider  both old and new passwords'
            })
        }
        //check old pass
        const isMatch = await user.comparePassword(oldPassword)
        if(!isMatch){
            return resp.status(500).send({
                success : false,
                message : 'Old Password is incorrect'
            })
        }
        //update new pass
        user.password = newPassword
        await user.save();
        resp.status(200).send({
            success : true,
            message : 'New Password Updated Successfully'
        })
    } catch (error) {
        resp.status(500).send({
            success : false,
            message : 'Update Password API Error',
            error
        })
    }
}


//update profile Photo
export const userProfilePicUpdateController = async (req, resp) => {
    try {
        const user = await userModel.findById(req.user._id)
        //get file from client
        const file = getDataUri(req.file)
        // Check if user has a profile picture
        if (user.profilePic && user.profilePic.public_id) {
            // Delete previous image
            await cloudinary.v2.uploader.destroy(user.profilePic.public_id);
        }
        //update image
        const cdb = await cloudinary.v2.uploader.upload(file.content)
        user.profilePic = {
            public_id : cdb.public_id,
            url : cdb.secure_url
        }
        //save updates
        await user.save()
        resp.status(200).send({
            success : true,
            message : 'Profile Image updated Successfully'
        })
    } catch (error) {
        resp.status(500).send({
            success : false,
            message : 'Profile Photo update API Error',
            error
        })
    }

   
}

// verification email send
async function sendVerificationEmail(email, confirmation_code)
{
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: "def258444@gmail.com",
                pass: "isgq nhcy wejr yotj" 
            }
        });
        const mailOptions = {
            from: "abc@gmail.com",
            to: email,
            subject: "Account Verification code",
            text: `Your account verification code is ${confirmation_code}`
        };
        await transporter.sendMail(mailOptions);

        console.log('verification sent');
    } catch(error){
        console.error('Error sending verification emai:', error);
        throw error;
    }
}