import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";
import { SkeletonPostList } from "../components/SkeletonLoader";
import { postService } from "../services/postService";
import { aiService } from "../services/aiService";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [aiContent, setAiContent] = useState("");
  const [useAiContent, setUseAiContent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [postLoading, setPostLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [commentText, setCommentText] = useState({});

  const { token } = useContext(AuthContext);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await postService.getAllPosts();
      setPosts(data.posts || []);
    } catch (error) {
      setToast({
        message: error.response?.data?.message || "Failed to fetch posts",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleRewrite = async () => {
    if (!content.trim()) {
      setToast({ message: "Please write something to rewrite", type: "warning" });
      return;
    }
    try {
      setAiLoading(true);
      const data = await aiService.rewriteContent(content);
      setAiContent(data.rewrittenContent);
      setToast({ message: "Content rewritten successfully!", type: "success" });
    } catch (error) {
      setToast({
        message: error.response?.data?.message || "Failed to rewrite content",
        type: "error",
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    const finalContent = useAiContent ? aiContent : content;

    if (!finalContent.trim()) {
      setToast({ message: "Post content cannot be empty", type: "warning" });
      return;
    }

    try {
      setPostLoading(true);
      await postService.createPost(finalContent);
      setContent("");
      setAiContent("");
      setUseAiContent(false);
      setToast({ message: "Post created successfully!", type: "success" });
      fetchPosts();
    } catch (error) {
      setToast({
        message: error.response?.data?.message || "Failed to create post",
        type: "error",
      });
    } finally {
      setPostLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await postService.likePost(postId);
      fetchPosts();
    } catch (error) {
      setToast({
        message: error.response?.data?.message || "Failed to like post",
        type: "error",
      });
    }
  };

  const handleComment = async (postId) => {
    if (!commentText[postId]?.trim()) {
      setToast({ message: "Comment cannot be empty", type: "warning" });
      return;
    }
    try {
      await postService.commentPost(postId, commentText[postId]);
      setCommentText({ ...commentText, [postId]: "" });
      fetchPosts();
    } catch (error) {
      setToast({
        message: error.response?.data?.message || "Failed to add comment",
        type: "error",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-2xl mx-auto py-8 px-4">
        {/* Create Post */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border">
          <h3 className="text-lg font-semibold mb-4">Create a Post</h3>

          <form onSubmit={handleCreatePost} className="space-y-4">
            <textarea
              className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
              rows="4"
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            {aiContent && (
              <div className={`p-4 border-l-4 rounded ${useAiContent ? 'bg-green-50 border-green-400' : 'bg-blue-50 border-blue-400'}`}>
                <p className="text-sm font-semibold mb-2">AI Suggestion</p>
                <p className="italic mb-3">{aiContent}</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setUseAiContent(!useAiContent)}
                    className={`px-3 py-1 text-sm rounded ${useAiContent ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                  >
                    {useAiContent ? '✓ Using AI' : 'Use This'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setContent(aiContent)}
                    className="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded"
                  >
                    Copy to Edit
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleRewrite}
                disabled={!content.trim() || aiLoading}
                className="flex-1 py-2 bg-purple-500 text-white rounded-lg disabled:opacity-50"
              >
                {aiLoading ? "Rewriting..." : "✨ Rewrite"}
              </button>

              <button
                type="submit"
                disabled={postLoading}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
              >
                {postLoading ? "Posting..." : "Post"}
              </button>
            </div>
          </form>
        </div>

        {/* Feed */}
        <h3 className="text-lg font-semibold mb-4">Feed</h3>

        {loading ? (
          <SkeletonPostList />
        ) : posts.length === 0 ? (
          <div className="text-center text-gray-500">No posts yet.</div>
        ) : (
          posts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-xl shadow p-6 mb-6 border"
            >
              <p className="font-semibold">{post.author?.name || "Anonymous"}</p>
              <p className="text-sm text-gray-500 mb-2">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>

              <p className="mb-4">{post.content}</p>

              <button
                onClick={() => handleLike(post._id)}
                className="text-blue-600 text-sm font-medium"
              >
                👍 {post.likes?.length || 0} Likes
              </button>

              {/* Comments */}
              <div className="mt-4 space-y-2">
                {post.comments?.map((c, i) => (
                  <div key={i} className="text-sm bg-gray-50 p-2 rounded">
                    <strong>{c.user?.name || "User"}:</strong> {c.text}
                  </div>
                ))}

                <div className="flex gap-2 mt-2">
                  <input
                    className="flex-1 border rounded px-3 py-1 text-sm"
                    placeholder="Add a comment..."
                    value={commentText[post._id] || ""}
                    onChange={(e) =>
                      setCommentText({
                        ...commentText,
                        [post._id]: e.target.value,
                      })
                    }
                  />
                  <button
                    onClick={() => handleComment(post._id)}
                    className="text-blue-600 text-sm font-medium"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
