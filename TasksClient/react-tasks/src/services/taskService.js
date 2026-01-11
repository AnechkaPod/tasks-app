import API from './api';

export const taskService = {
  getAll: async () => {
    const response = await API.get('/tasks');
    return response.data;
  },
  getById: async (id) => {
    const response = await API.get(`/tasks/${id}`);
    return response.data;
  },
  create: async (taskData) => {
    const response = await API.post('/tasks', taskData);
    return response.data;
  },
  update: async (id, taskData) => {
    const response = await API.put(`/tasks/${id}`, taskData);
    return response.data;
  },
  delete: async (id) => {
    const response = await API.delete(`/tasks/${id}`);
    return response.data;
  }
};