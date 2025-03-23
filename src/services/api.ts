import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const fetchHello = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}`);
    console.log('RESPONSE', response);

    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const passwordResetApi = {
  requestPasswordReset: async (email: string): Promise<void> => {
    console.log('requestPasswordReset', email);
    await api.post('/auth/forgot-password', { email });
  },

  resetPassword: async (token: string, password: string): Promise<void> => {
    await api.post('/auth/reset-password', { token, password });
  },
};

const sendPasswordResetEmail = async (email: string, resetUrl: string) => {
  try {
    const response = await axios.post('/email/password-reset', {
      email,
      resetUrl,
    });
    console.log('Email sent:', response.data);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export { sendPasswordResetEmail };
