import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const OAuth = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Get the token from the URL query parameters
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        
        if (!token) {
          throw new Error('No token found');
        }
        
        // Store the token
        localStorage.setItem('token', token);
        
        // Get user data
        api.defaults.headers.Authorization = `Bearer ${token}`;
        const response = await api.get('/auth/me');
        
        login(response.data, token);
        navigate('/dashboard');
      } catch (err) {
        console.error('OAuth callback error:', err);
        setError('Authentication failed. Please try again.');
        setLoading(false);
      }
    };
    
    handleOAuthCallback();
  }, [location, login, navigate]);
  
  if (loading) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>Authenticating...</h2>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>Authentication Error</h2>
          <div className="alert alert-danger">{error}</div>
          <button 
            onClick={() => navigate('/login')} 
            className="btn btn-primary"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }
  
  return null;
};

export default OAuth;