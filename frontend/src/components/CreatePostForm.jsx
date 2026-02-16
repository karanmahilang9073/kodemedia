import { useState } from "react";
import { postService } from "../services/postService";
import { aiService } from "../services/aiService";

const CreatePostForm = ({ onPostCreated, setToast }) => {
  const [content, setContent] = useState("");
  const [aiContent, setAiContent] = useState("");
  const [useAiContent, setUseAiContent] = useState(false);
  const [postLoading, setPostLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

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
      onPostCreated();
    } catch (error) {
      setToast({
        message: error.response?.data?.message || "Failed to create post",
        type: "error",
      });
    } finally {
      setPostLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8 border">
      <h3 className="text-lg font-semibold mb-4">Create a Post</h3>

      <form onSubmit={handleCreatePost} className="space-y-4">
        <textarea
          id="post-content"
          name="content"
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
  );
};

export default CreatePostForm;
