import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userName = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        avatar: {
            type: String, //cloudinary url
            required: true
        },
        coverImage: {
            type: String, // cloudinary url
        },
        watcHistory: [
            {
                type: Schema.Types, ObjectId,
                ref: "video"
            }
        ],
        password: {
            type:string,
            required: [true, 'password is required']
        },
        refreshTokens: {
            type: string
        }
    },
    {
        timestamps:true
    }
)

userSchema.pre("save", async function (next) {
    if(!this.isModified("password"))return next();

    this.paswword = bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods,generateAccesTokens = function(){
    return jwt.sign(
        {
            id: this._id,
            email: this.email,
            userName: this.userName,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods,generateRefreshTokens = function(){
    return jwt.sign(
        {
            id: this._id,

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )}



export const user = mongoose.model("User", userSchema)