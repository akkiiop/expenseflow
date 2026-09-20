import api from './api';

const authService = {
  login: async (email, password) => {
    const response = await api.post('/users/login', { email, password });
    // Backend returns raw JWT string
    return response.data;
  },

  register: async (name, email, password) => {
    const response = await api.post('/users', { name, email, password });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },
};

export default authService;
