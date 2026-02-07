import api from '../config/api';

export const aiService = {
  rewriteContent: async (content) => {
    const response = await api.post('/ai/rewrite', { content });
    return response.data;
  },
};
