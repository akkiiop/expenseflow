import api from './api';

const budgetService = {
  getMyBudgets: async () => {
    const response = await api.get('/budgets/my-budgets');
    return response.data;
  },

  getBudgetById: async (id) => {
    const response = await api.get(`/budgets/${id}`);
    return response.data;
  },

  createBudget: async (data) => {
    const response = await api.post('/budgets', data);
    return response.data;
  },

  updateBudget: async (id, data) => {
    const response = await api.put(`/budgets/${id}`, data);
    return response.data;
  },

  deleteBudget: async (id) => {
    const response = await api.delete(`/budgets/${id}`);
    return response.data;
  },
};

export default budgetService;
