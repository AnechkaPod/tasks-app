import API from './api';

export const userService = {
  getAll: async () => {
    console.log("userService.getAll");
    const response = await API.get('/users');
    return response.data;
  },
  getById: async (id) => {
    const response = await API.get(`/users/${id}`);
    return response.data;
  },
  create: async (userData) => {
    console.log('create',userData);
    const response = await API.post('/users', userData);
    return response.data;
  },
  update: async (id, userData) => {
    const response = await API.put(`/users/${id}`, userData);
    return response.data;
  },
  delete: async (id) => {
    const response = await API.delete(`/users/${id}`);
    return response.data;
  }
};