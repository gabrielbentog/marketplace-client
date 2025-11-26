import api from '@/lib/api';

export const AuthService = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/api/authenticate', { authentication: credentials });
    // O interceptor já salvará os headers
    if (typeof window !== 'undefined') {
        localStorage.setItem('gm_user', JSON.stringify(response.data.data || response.data));
    }
    return response.data;
  },
  
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('gm_auth_headers');
      localStorage.removeItem('gm_user');
      // Opcional: chamar endpoint de delete sign_out se existir
    }
  }
};