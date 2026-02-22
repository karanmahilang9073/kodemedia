import { useCallback, useMemo, useState } from "react";
import { postService } from "../services/postService";

const CommentSection = ({ post, setToast, onCommentAdded }) => {
  const [commentText, setCommentText] = useState("");
  const [expanded, setExpanded] = useState(false)

  const INITIAL_COMMENTS = 2

  const reversedComments = useMemo(() => {
    return [...(post.comments || [])].reverse()
  }, [post.comments])

  const commentsToShow = expanded ? reversedComments : reversedComments.slice(0, INITIAL_COMMENTS)

  const handleComment = useCallback(async()=> {
    if(!commentText.trim()){
      setToast({message : 'comments cannot be empty', type : 'warning'})
      return
    }
    try {
      await postService.commentPost(post._id, commentText)
      setCommentText("")
      onCommentAdded();
    } catch (error) {
      setToast({message : error?.response?.data?.message || 'failed to add comment', type : "error"})
    }
  }, [commentText, post._id, onCommentAdded, setToast])

  return (
    <div className="mt-4 space-y-2">
      {reversedComments.length > 0 ? (
        <>
          {commentsToShow.map((c) => (
            <div key={c._id || c.createdAt} className="text-sm bg-gray-50 p-2 rounded">
              <strong>{c.user?.name || "user"}:</strong> {c.text}
            </div>
          ))}

          {reversedComments.length > INITIAL_COMMENTS && (
            <button onClick={() => setExpanded(prev => !prev)} className="text-blue-600 text-xs font-medium hover:underline mt-2">
              {expanded ? "see less" : `see (+${reversedComments.length - INITIAL_COMMENTS} more)`}
            </button>
          )}
        </>
      ) : (
        <p className="text-sm text-gray-400">no comments yet</p>
      )}

      <div className="flex gap-2 mt-2">
        <input className="flex-1 border rounded px-3 py-1 text-sm" placeholder="add a comment..." value={commentText} onChange={(e) => setCommentText(e.target.value)} onKeyDown={(e) => e.key === 'enter' && handleComment()} />
      <button className="text-blue-600 text-sm font-medium hover:underline" onClick={handleComment}>send</button>
      </div>
    </div>
  );
};

export default CommentSection;
