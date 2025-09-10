import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/auth/signin', formData);
      onLogin(response.data.accessToken, response.data);
    } catch (error) {
      setError(error.response?.data?.message || '❌ Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌱</div>
          <h2 style={{ color: '#2e7d32', fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>
            Welcome Back
          </h2>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>Sign in to your eco-friendly account</p>
        </div>

        {error && (
          <div className="error" style={{ marginBottom: '2rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>👤 Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Enter your username"
            />
          </div>

          <div className="form-group">
            <label>🔒 Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-success" 
            disabled={loading}
            style={{ 
              width: '100%', 
              fontSize: '1.2rem', 
              padding: '1rem',
              marginBottom: '2rem'
            }}
          >
            {loading ? '🔄 Signing in...' : '🚀 Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#666' }}>
            Don't have an account?{' '}
            <Link 
              to="/register" 
              style={{ 
                color: '#4caf50', 
                textDecoration: 'none', 
                fontWeight: '600',
                borderBottom: '2px solid transparent',
                transition: 'border-color 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.borderBottomColor = '#4caf50'}
              onMouseOut={(e) => e.target.style.borderBottomColor = 'transparent'}
            >
              Create one here 📝
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;