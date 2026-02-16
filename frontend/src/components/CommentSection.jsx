import { useState } from "react";
import { postService } from "../services/postService";

const CommentSection = ({ post, expandedComments, setExpandedComments, setToast, onCommentAdded }) => {
  const [commentText, setCommentText] = useState("");

  const handleComment = async () => {
    if (!commentText.trim()) {
      setToast({ message: "Comment cannot be empty", type: "warning" });
      return;
    }
    try {
      await postService.commentPost(post._id, commentText);
      setCommentText("");
      onCommentAdded();
    } catch (error) {
      setToast({
        message: error.response?.data?.message || "Failed to add comment",
        type: "error",
      });
    }
  };

  return (
    <div className="mt-4 space-y-2">
      {post.comments && post.comments.length > 0 ? (
        <>
          {(() => {
            const reversedComments = [...post.comments].reverse();
            const isExpanded = expandedComments[post._id];
            const INITIAL_COMMENTS = 2;
            const commentsToShow = isExpanded ? reversedComments : reversedComments.slice(0, INITIAL_COMMENTS);
            
            return (
              <>
                {commentsToShow.map((c, i) => (
                  <div key={i} className="text-sm bg-gray-50 p-2 rounded">
                    <strong>{c.user?.name || "User"}:</strong> {c.text}
                  </div>
                ))}
                {reversedComments.length > INITIAL_COMMENTS && (
                  <button
                    onClick={() => setExpandedComments({
                      ...expandedComments,
                      [post._id]: !isExpanded
                    })}
                    className="text-blue-600 text-xs font-medium hover:underline mt-2"
                  >
                    {isExpanded ? `See Less (−)` : `See More (+${reversedComments.length - INITIAL_COMMENTS} more)`}
                  </button>
                )}
              </>
            );
          })()}
        </>
      ) : (
        <p className="text-sm text-gray-400">No comments yet</p>
      )}

      <div className="flex gap-2 mt-2">
        <input
          className="flex-1 border rounded px-3 py-1 text-sm"
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleComment()}
        />
        <button
          onClick={handleComment}
          className="text-blue-600 text-sm font-medium hover:underline"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default CommentSection;
