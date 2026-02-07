import User from "../models/User.js";
import bcryp, { genSaltSync } from 'bcryptjs'
import generateToken from "../utils/generateToken.js";


export const registerUser = async(req,res)=>{
    try {
        const {name,email,password} = req.body;
        const existed = await User.findOne({email})
        if (existed) {
            return res.status(401).json({message : 'user already existed'})
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
        res.status(200).json({
            userId : user._id,
            email : user.email,
            token : token,
        })
    } catch (error) {
        res.status(500).json({message : 'internal server error'})
    }

}