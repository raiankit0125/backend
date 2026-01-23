import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { user } from "../models/user.model.js"
import { uploadCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { useReducer } from "react";

const generateAccessAndRefreshTokens = async(userId => {
    try {
        const user = await user.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
})

const registerUser = asyncHandler(async (req, res) => {
    //get user details from frontend
    //validation - not empty 
    //check for images, check for avatar
    //upload them to cloudinary,avatar
    // crete user object - create entry in db
    //remove password and refresh token field from response
    //chek for user creation 
    //return res

    const { fullName, email, username, password } = req.body
    console.log("email: ", email);

    // if (fullName === "") {
    //     throw new ApiError(400, "fullname is required")
    // }

    if (
        [fullName, email, username, password].some((field) =>
            field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await user.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email and username already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }


    const avatar = await uploadCloudinary(avatarLocalPath)
    const coverImage = await uploadCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

    const userModel = await user.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await user.findById(userModel._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "somethingh went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "user registered succesfully")
    )

})

const loginUser = asyncHandler(async (req, res) => {
    // req body -> data
    //  username or email
    // find the user
    // password check
    // access and refresh token
    // send cookie

    const { email, username, password } = req.body

    if (!username || !email) {
        throw new ApiError(400, "username or email is required")
    }

    const user = await user.findone({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = user.findbyId(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure : true
    }

    return res
    .status(200)
    .cookie("acessToken",accessToken, options)
    .cookie("refreshToken", options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged in succesfully"
        )
    )
})

const logoutUser = asyncHandler(async(req, res) => {
   await user.findByIdAndUpdate()
    req.user._id,{
        $set: {
            refreshToken: undefined
        }
    },
    {
        new:true
    }

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

export {
    registerUser,
    loginUser,
    logoutUser
}