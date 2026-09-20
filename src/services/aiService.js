import api from './api';

const aiService = {
  getInsights: async () => {
    const response = await api.get('/ai/insights');
    return response.data;
  },
};

export default aiService;
