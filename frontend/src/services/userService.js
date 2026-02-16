import api from '../config/api';

export const userService = {
  getUserProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateUser: async (name, email) => {
    const response = await api.put('/auth/update', {
      name,
      email,
    });
    return response.data;
  },

  deleteUser: async () => {
    const response = await api.delete('/auth/delete');
    return response.data;
  },
};

export default userService;
