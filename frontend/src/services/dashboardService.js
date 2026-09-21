import api from './api';

const dashboardService = {
  getSummary: async (month, year) => {
    const response = await api.get('/dashboard/summary', {
      params: { month, year },
    });
    return response.data;
  },
};

export default dashboardService;
