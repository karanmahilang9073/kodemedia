import { asyncHandler } from "../middleware/asynchandler.js";
import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HF_TOKEN);

export const rewritePost = asyncHandler(async(req, res) =>{
  const {content} = req.body
  if(!content || !content.trim()){
    const error = new Error('content is required')
    error.statusCode = 400
    throw error
  }

  if(content.length > 1000){
    const error = new Error('content too long (max 1000 characters)')
    error.statusCode = 400
  }

  const response = await hf.chatCompletion({
    model : "mistralai/Mistral-7B-Instruct-v0.2",
    messages : [{
      role : "user",
      content : `rewrite this social media post clearly and engagingly without changing its meaning:\n\n${content.trim()}`
    }],
    max_tokens : 150,
  }) 

  const rewritten = response?.choices?.[0]?.message?.content
  if(!rewritten){
    const error = new Error('AI failed to generate response')
    error.statusCode = 500
    throw error
  }

  res.status(200).json({success : true, rewrittenContent : rewritten})
})