import User from "../models/User.js";
import bcryp, { genSaltSync } from 'bcryptjs'
import generateToken from "../utils/generateToken.js";
import Post from "../models/Post.js";


export const registerUser = async(req,res)=>{
    try {
        const {name,email,password} = req.body;
        const existed = await User.findOne({email})
        if (existed) {
            return res.status(409).json({message : 'user already existed'})
        }
        const hashed = await bcryp.hash(password, 10)
        const user = new User({name, email, password : hashed})
        await user.save()
        res.status(200).json({message : "user created successfully"})
    } catch (error) {
        console.log('failed to create user')
        return res.status(500).json({message : "internal server error"})
    }
}

export const loginUser = async(req,res)=>{
    try {
        const {email, password} = req.body
        const user = await User.findOne({email})
        if (!user) {
            return res.status(401).json({message : 'user not found'})
        }
        const compare = await bcryp.compare(password, user.password)
        if (!compare) {
            return res.status(400).json({message : 'password doesnot matched'})
        }
        const token = generateToken(user._id)
        const userId = user._id.toString()
        console.log('Login - returning userId:', userId)
        res.status(200).json({
            userId : userId,
            email : user.email,
            token : token,
        })
    } catch (error) {
        res.status(500).json({message : 'internal server error'})
    }

}

export const getUserProfile = async(req,res)=>{
    try {
        const userId = req.user.id
        const user = await User.findById(userId).select('-password')
        if (!user) {
            return res.status(404).json({message : 'user not found'})
        }
        res.status(200).json({user})
    } catch (error) {
        res.status(500).json({message : 'internal server error'})
    }
}

export const updateUser = async(req,res)=>{
    try {
        const userId = req.user.id
        const {name, email} = req.body
        
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({message : 'user not found'})
        }
        
        // Check if email is already taken by another user
        if (email && email !== user.email) {
            const existingUser = await User.findOne({email})
            if (existingUser) {
                return res.status(400).json({message : 'email already in use'})
            }
        }
        
        if (name) user.name = name
        if (email) user.email = email
        
        await user.save()
        res.status(200).json({message : 'user updated successfully', user : {_id: user._id, name: user.name, email: user.email}})
    } catch (error) {
        res.status(500).json({message : 'internal server error'})
    }
}

export const deleteUser = async(req,res)=>{
    try {
        const userId = req.user.id
        const user = await User.findById(userId)
        
        if (!user) {
            return res.status(404).json({message : 'user not found'})
        }
        
        // Delete all posts by this user
        await Post.deleteMany({author: userId})
        
        // Delete the user
        await User.findByIdAndDelete(userId)
        
        res.status(200).json({message : 'user account deleted successfully'})
    } catch (error) {
        res.status(500).json({message : 'internal server error'})
    }
}