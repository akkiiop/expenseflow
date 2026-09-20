import api from './api';

const categoryService = {
  getMyCategories: async () => {
    const response = await api.get('/categories/my-categories');
    return response.data;
  },

  getCategoryById: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  createCategory: async (name) => {
    const response = await api.post('/categories', { name });
    return response.data;
  },

  updateCategory: async (id, name) => {
    const response = await api.put(`/categories/${id}`, { name });
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};

export default categoryService;
