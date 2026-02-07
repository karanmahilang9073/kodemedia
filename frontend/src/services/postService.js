import api from '../config/api';

export const postService = {
  getAllPosts: async (page = 1, limit = 10) => {
    const response = await api.get('/posts', {
      params: { page, limit },
    });
    return response.data;
  },

  createPost: async (content) => {
    const response = await api.post('/posts', { content });
    return response.data;
  },

  likePost: async (postId) => {
    const response = await api.put(`/posts/${postId}/like`, {});
    return response.data;
  },

  commentPost: async (postId, text) => {
    const response = await api.post(`/posts/${postId}/comment`, { text });
    return response.data;
  },
};
