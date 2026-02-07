import Post from "../models/Post.js";



export const createPost = async(req, res)=>{
    try {
        const {content} = req.body;
        if (!content) {
            return res.status(401).json({message : "content is required"})
        }
        const post = new Post({
            content, 
            author:req.user
        }) 
        await post.save()
        res.status(200).json({message : "post created successfully", post})
    } catch (error) {
        res.status(500).json({ message: "failed to create post" });
    }
}

export const getPosts = async(req,res)=>{
    try {
        const posts = await Post.find().sort({createdAt : -1}).populate("author","name email").populate('comments.user','name email')
        res.status(200).json({posts})
    } catch (error) {
        res.status(500).json({message : "failed to fetch posts"})
    }
}

export const likePost = async(req,res)=>{
    try {
        const {postId} = req.params
        const userId = req.user
        const post = await Post.findById(postId)
        if (!post) {
            return res.status(400).json({message : "post not found"})
        }
        if (post.likes.includes(userId)) {
            post.likes = post.likes.filter(
                (id) => id.toString() != userId.toString()
            )
        }else{
            post.likes.push(userId)
        }
        await post.save()
        res.status(200).json({message : "likes updated", likesCount : post.likes.length})
    } catch (error) {
        res.status(500).json({message : "failed to like post"})
    }
}

export const addComment = async(req,res)=>{
    try {
        const {postId} = req.params
        const {text} = req.body
        const userId = req.user
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
        if (post.author.toString() != req.user) {
            return res.status(403).json({message : "not authorized to delete the post"})
        }
        await post.deleteOne()
        res.status(200).json({message : "post deleted successfully"})
    } catch (error) {
        res.status(500).json({message : "failed to delete post"})
    }
}