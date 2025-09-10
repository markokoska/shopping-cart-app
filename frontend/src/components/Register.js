import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Register = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
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
      const response = await axios.post('/auth/signup', formData);
      const loginResponse = await axios.post('/auth/signin', {
        username: formData.username,
        password: formData.password
      });
      onLogin(loginResponse.data.accessToken, loginResponse.data);
    } catch (error) {
      setError(error.response?.data?.message || '❌ Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌿</div>
          <h2 style={{ color: '#2e7d32', fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>
            Join EcoShop
          </h2>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>Create your sustainable shopping account</p>
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
              placeholder="Choose a unique username"
            />
          </div>

          <div className="form-group">
            <label>📧 Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email address"
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
              placeholder="Create a secure password"
              minLength="6"
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
            {loading ? '🔄 Creating account...' : '🌱 Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#666' }}>
            Already have an account?{' '}
            <Link 
              to="/login" 
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
              Sign in here 🔑
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;