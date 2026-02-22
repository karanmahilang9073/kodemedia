import { useCallback, useState } from "react";
import CommentSection from "./CommentSection";
import { postService } from "../services/postService";
import React from "react";

const PostCard = ({ post, userId, setToast,  onPostUpdated, onOptimisticLike }) => {
  const [editingPostId, setEditingPostId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [deletePostId, setDeletePostId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const authorId = post.author?._id || post.author;
  const isAuthor = userId && authorId && String(userId) === String(authorId);

  const handleEditPost = (post) => {
    setEditingPostId(post._id);
    setEditContent(post.content);
  };

  const handleUpdatePost = async (postId) => {
    if (!editContent.trim()) {
      setToast({ message: "Post content cannot be empty", type: "warning" });
      return;
    }
    try {
      setEditLoading(true);
      await postService.updatePost(postId, editContent);
      setEditingPostId(null);
      setEditContent("");
      setToast({ message: "Post updated successfully!", type: "success" });
      onPostUpdated();
    } catch (error) {
      setToast({
        message: error.response?.data?.message || "Failed to update post",
        type: "error",
      });
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      setDeleteLoading(true);
      await postService.deletePost(postId);
      setDeletePostId(null);
      setToast({ message: "Post deleted successfully!", type: "success" });
      onPostUpdated();
    } catch (error) {
      setToast({
        message: error.response?.data?.message || "Failed to delete post",
        type: "error",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  //like click optimized (fast updation)
  const handleLike = useCallback(async() => {
    onOptimisticLike(post._id, userId)
    try {
      await postService.likePost(post._id)
    } catch (error) {
      onOptimisticLike(post._id, userId) //rollback if failed 
      setToast({message : error?.response?.data?.message || 'failed to like post', type : 'error'})
    }
  }, [post._id, userId, onOptimisticLike, setToast])

  return (
    <div
      key={post._id}
      className="bg-white rounded-xl shadow p-6 mb-6 border"
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-semibold">{post.author?.name || "Anonymous"}</p>
          <p className="text-sm text-gray-500">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
        {isAuthor && (
          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => handleEditPost(post)}
              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded"
            >
              ✏️ Edit
            </button>
            <button
              onClick={() => setDeletePostId(post._id)}
              className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded"
            >
              🗑️ Delete
            </button>
          </div>
        )}
      </div>

      {editingPostId === post._id ? (
        <div className="space-y-3 mb-4">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
            rows="4"
          />
          <div className="flex gap-2">
            <button
              onClick={() => handleUpdatePost(post._id)}
              disabled={editLoading}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg disabled:opacity-50"
            >
              {editLoading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => {
                setEditingPostId(null);
                setEditContent("");
              }}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="mb-4">{post.content}</p>
      )}

      {deletePostId === post._id && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm font-semibold mb-3">
            Are you sure you want to delete this post? This action cannot be undone.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handleDeletePost(post._id)}
              disabled={deleteLoading}
              className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded disabled:opacity-50"
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </button>
            <button
              onClick={() => setDeletePostId(null)}
              className="px-3 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 text-sm rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => handleLike(post._id)}
        className="text-blue-600 text-sm font-medium hover:underline"
      >
        👍 {post.likes?.length || 0} Likes
      </button>

      {/* Comments Section */}
      <CommentSection
        post={post}
        setToast={setToast}
        onCommentAdded={onPostUpdated}
      />
    </div>
  );
};

export default React.memo(PostCard);
