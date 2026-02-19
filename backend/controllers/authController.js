import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import Post from "../models/Post.js";
import { asyncHandler } from "../middleware/asynchandler.js";
import bcrypt from "bcryptjs";


export const registerUser = asyncHandler(async(req, res) => {
    const {name, email, password} = req.body;
    if(!name || !email || !password){
        const error = new Error('all fields are required')
        error.statusCode = 400
        throw error
    }
    if(password.length < 6){
        const error = new Error('password must be atleast 6 characters')
        error.statusCode = 400
        throw error
    }

    const existed = await User.findOne({email})
    if(existed){
        const error = new Error('user already existed')
        error.statusCode = 400
        throw error
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({name, email, password : hashedPassword})

    res.status(201).json({success : true, message : 'user created successfully', 
        user : {
            _id : user._id,
            name : user.name,
            email : user.email,
        }
    })
})

export const loginUser = asyncHandler(async(req, res) => {
    const {email, password} = req.body
    if(!email || !password){
        const error = new Error('email and password are required')
        error.statusCode = 400
        throw error
    }

    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({email : normalizedEmail})
    if(!user){
        const error = new Error('invalid email or password')
        error.statusCode = 401
        throw error
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        const error = new Error('invalid email or password')
        error.statusCode = 401
        throw error
    }

    const token = generateToken(user._id)

    res.status(200).json({success : true, token, 
        user : {
            _id : user._id,
            name : user.name,
            email : user.email
        }
    })

})

export const getUserProfile = asyncHandler(async(req, res) =>{
    const userId = req.user.id
    const user = await User.findById(userId).select("-password")
    if(!user){
        const error = new Error('user not found')
        error.statusCode = 404
        throw error
    }
    res.status(200).json({success : true, user})
})

export const updateUser = asyncHandler(async(req, res) =>{
    const userId = req.user.id 
    const {name, email} = req.body

    const user = await User.findById(userId)
    if(!user){
        const error = new Error('user not found')
        error.statusCode = 404
        throw error
    }

    if(email && email.toLowerCase() !== user.email){
        const normalizedEmail = email.toLowerCase()

        const existingUser = await User.findOne({email : normalizedEmail})
        if(existingUser){
            const error = new Error('email already in use')
            error.statusCode = 409
            throw error
        }
        user.email = normalizedEmail
    }

    if(name && name.trim()){
        user.name = name.trim()
    }

    await user.save()

    res.status(200).json({success : true, message : 'user updated successfully',
        user : {
            _id : user._id,
            name : user.name,
            email : user.email
        }
    })
})

export const deleteUser  = asyncHandler(async(req, res) => {
    const userId = req.user.id
    const deleted = await User.findByIdAndDelete(userId)
    if(!deleted){
        const error = new  Error('user not found')
        error.statusCode = 404
        throw error
    }

    await Post.deleteMany({author : userId}) //delete post also that are created by the user 
    
    res.status(200).json({success : true, message : 'user deleted successfully'})
})