import api from './api';

const reportService = {
  getSummary: async () => {
    const response = await api.get('/reports/summary');
    return response.data;
  },
};

export default reportService;
