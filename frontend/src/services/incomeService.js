import api from './api';

const incomeService = {
  getMyIncomes: async (page = 0, size = 10) => {
    const response = await api.get('/incomes/my-incomes', {
      params: { page, size },
    });
    return response.data;
  },

  getIncomeById: async (id) => {
    const response = await api.get(`/incomes/${id}`);
    return response.data;
  },

  createIncome: async (data) => {
    const response = await api.post('/incomes', data);
    return response.data;
  },

  updateIncome: async (id, data) => {
    const response = await api.put(`/incomes/${id}`, data);
    return response.data;
  },

  deleteIncome: async (id) => {
    const response = await api.delete(`/incomes/${id}`);
    return response.data;
  },
};

export default incomeService;
