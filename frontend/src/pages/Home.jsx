import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";
import { SkeletonPostList } from "../components/SkeletonLoader";
import CreatePostForm from "../components/CreatePostForm";
import PostCard from "../components/PostCard";
import { postService } from "../services/postService";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const { userId } = useContext(AuthContext);

  const fetchPosts = useCallback(async () =>{
    try {
      setLoading(true)
      const data = await postService.getAllPosts()
      setPosts(data.posts || [])
    } catch (error) {
      setToast({message : error?.response?.data?.message || "failed to fetch posts", type : "error"})
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPosts();
  }, []);

  //for fast like update
  const handleOptimisticLike = (postId, userId) => {
    setPosts(prev => prev.map(post => {
      if(post._id !== postId) return post
      const alreadyLiked = post.likes.includes(userId)
      const updatedLikes = alreadyLiked ? post.likes.filter(id => id !== userId) : [...post.likes, userId]
      return {...post, likes : updatedLikes}
    }))
  }

  //for fast comment update (no page reload)
  const handleOptimisticComment = (postId, newComment) => {
    setPosts(prev => prev.map(post => {
      if(post._id !== postId) return post
      return {...post, comments: [...(post.comments || []), newComment]}
    }))
  }

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

      <div className="max-w-2xl mx-auto pt-16 pb-8 px-4">
        {/* Create Post Form */}
        <CreatePostForm onPostCreated={fetchPosts} setToast={setToast} />

        {/* Feed */}
        <h3 className="text-lg font-semibold mb-4">enjoy your feed...</h3>

        {loading ? (
          <SkeletonPostList />
        ) : posts.length === 0 ? (
          <div className="text-center text-gray-500">No posts yet.</div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              userId={userId}
              setToast={setToast}
              onPostUpdated={fetchPosts}
              onOptimisticLike={handleOptimisticLike}
              onCommentAdded={handleOptimisticComment}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
