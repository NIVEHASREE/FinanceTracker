import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { login, googleOAuth, githubOAuth } from '../../services/auth';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await login(formData);
      authLogin(response.user, response.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleGoogleOAuth = (e) => {
    e.preventDefault();
    console.log('Google OAuth button clicked');
    googleOAuth();
  };

  const handleGithubOAuth = (e) => {
    e.preventDefault();
    console.log('GitHub OAuth button clicked');
    githubOAuth();
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login to Finance Tracker</h2>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={onChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>
        
        <div className="oauth-section">
          <p>Or login with:</p>
          <div className="oauth-buttons">
            <button onClick={handleGoogleOAuth} className="btn btn-google">
              Google
            </button>
            <button onClick={handleGithubOAuth} className="btn btn-github">
              GitHub
            </button>
          </div>
        </div>
        
        <p className="auth-redirect">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;