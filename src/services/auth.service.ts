import axios from 'axios';
import { LoginCredentials, ForgotPasswordData, ForgotEmailData } from '../types/auth.types.ts';

const API_URL = 'http://localhost:8081/bff';

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    return response.data;
  },
  
  forgotPassword: async (data: ForgotPasswordData) => {
    const response = await axios.post(`${API_URL}/auth/forgot-password`, data);
    return response.data;
  },
  
  forgotEmail: async (data: ForgotEmailData) => {
    const response = await axios.post(`${API_URL}/auth/recover-email`, data);
    return response.data;
  }
};
