import api from './api';

const expenseService = {
  getMyExpenses: async (page = 0, size = 10, categoryId = null) => {
    const params = { page, size };
    if (categoryId) params.categoryId = categoryId;
    const response = await api.get('/expenses/my-expenses', { params });
    return response.data;
  },

  getExpenseById: async (id) => {
    const response = await api.get(`/expenses/${id}`);
    return response.data;
  },

  createExpense: async (data) => {
    const response = await api.post('/expenses', data);
    return response.data;
  },

  updateExpense: async (id, data) => {
    const response = await api.put(`/expenses/${id}`, data);
    return response.data;
  },

  deleteExpense: async (id) => {
    const response = await api.delete(`/expenses/${id}`);
    return response.data;
  },
};

export default expenseService;
