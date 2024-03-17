import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import Jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
    first_name: {
        type: String,
        // require: [true, 'Name is require']
    },
    last_name: {
        type: String,
        // require: [true, 'Name is require']
    },
    email: {
        type: String,
        require: [true, 'Email is require'],
        unique: [true, 'Email already taken']
    },
    password: {
        type: String,
        require: [true, 'password is required'],
        minLength: [6, 'password must be greater then 6 characters']
    },
    confirmation_code: {
        type: String,
        // require: [true, 'confirmation code is required']
    },
    email_verify_at: {
        type: Date,
        default: null
    },
    adress: {
        type: String,
        // require: [true, 'Adress is require']
    },
    city: {
        type: String,
        // require: [true, 'City is require']
    },
    post_code: {
        type: String,
        // require: [true, 'country is require']
    },
    phone: {
        type: String,
        // require: [true, 'Phone no. is require']
    },
    dob: {
        type: Date,
        // require: [true, 'Date of Birth is require']
    },
    profilePic: {
        public_id : {
            type : String
        },
        url : {
            type : String
        }
    }
}, { timestamps: true })

//functions
//hash function
UserSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next()  //prevent double encryption of password when the user profile updated
    this.password = await bcrypt.hash(this.password, 10)
})

//decrypt function
UserSchema.methods.comparePassword = async function (plainPassword) {
    return await bcrypt.compare(plainPassword, this.password);
}

//token generate
UserSchema.methods.tokenGenerate = function () {
    return Jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

export const userModel = mongoose.model("Users", UserSchema)