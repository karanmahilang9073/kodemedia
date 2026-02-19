import Post from "../models/Post.js";
import {asyncHandler} from '../middleware/asynchandler.js'

export const createPost = asyncHandler(async(req,res) => {
    const {content} = req.body
    if(!content){
        const error = new Error('content is required')
        error.statusCode = 400;
        throw error;
    }
    const post = new Post({content, author : req.user.id})

    await post.save()

    res.status(200).json({success : true, message : 'post created successsfully'})
})


export const getPosts = asyncHandler(async(req,res) => {
    const page = Number(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find() //all post
        .sort({createdAt  : -1}) //newest post (descending order)
        .skip(skip) //skip some post based on page number
        .limit(limit) //only limited page returns
        .populate("author", "_id name email") //returns id, name, email
        .populate({path : "comments.user", select : "_id name email"})

    const totalPosts = await Post.countDocuments();

    res.status(200).json({success : true, page, totalpages : Math.ceil(totalPosts / limit), totalPosts, posts})
})




export const likePost = asyncHandler(async(req, res) =>{
    const {postId} = req.params
    const userId = req.user.id
    const post = await Post.findById(postId)
    if(!post){
        const error = new Error('post not found')
        error.statusCode = 404
        throw error
    }
    const isLiked = post.likes.includes(userId)
    const update = isLiked ? {$pull : {likes : userId}} : {$addToSet : {likes : userId}}

    const updatePost = await Post.findByIdAndUpdate(postId, update, {new : true})

    res.status(200).json({success : true, message : 'like updated successfully', likesCount : updatePost.likes.length})
})

export const addComment = async(req,res)=>{
    try {
        const {postId} = req.params
        const {text} = req.body
        const userId = req.user.id
        const post = await Post.findById(postId)
        if (!post) {
            return res.status(404).json({message : "post not found"})
        }
        post.comments.push({text, user : userId});
        await post.save()
        res.status(200).json({
            message : "comment added successfully",
            commentsCount : post.comments.length
        })
    } catch (error) {
        res.status(500).json({message : "failed to add comment"})
    }
}

export const deletePost = async(req,res)=>{
    try {
        const {postId} = req.params;
        const post = await Post.findById(postId)
        if (!post) {
            return res.status(404).json({message : "post didnot found"})
        }
        if (post.author.toString() != req.user.id) {
            return res.status(403).json({message : "not authorized to delete the post"})
        }
        await post.deleteOne()
        res.status(200).json({message : "post deleted successfully"})
    } catch (error) {
        res.status(500).json({message : "failed to delete post"})
    }
}

export const updatePost = async(req,res)=>{
    try {
        const {postId} = req.params;
        const {content} = req.body;
        
        if (!content || !content.trim()) {
            return res.status(400).json({message : "content is required"})
        }
        
        const post = await Post.findById(postId)
        if (!post) {
            return res.status(404).json({message : "post not found"})
        }
        
        if (post.author.toString() != req.user.id) {
            return res.status(403).json({message : "not authorized to update the post"})
        }
        
        post.content = content
        await post.save()
        
        res.status(200).json({message : "post updated successfully", post})
    } catch (error) {
        res.status(500).json({message : "failed to update post"})
    }
}