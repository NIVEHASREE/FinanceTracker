import api from './api';

// Register user
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

// Login user
export const login = async (userData) => {
  const response = await api.post('/auth/login', userData);
  return response.data;
};

// Get current user
export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// Google OAuth
export const googleOAuth = () => {
  window.location.href = "http://localhost:5000/api/auth/google";
};

// GitHub OAuth
export const githubOAuth = () => {
  window.location.href = `${window.location.origin}/api/auth/github`;
};