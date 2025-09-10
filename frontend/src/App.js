import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import OrderHistory from './components/OrderHistory';
import AdminPanel from './components/AdminPanel';

// Set up axios defaults
axios.defaults.baseURL = 'http://localhost:8080/api';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Fetch user details including role
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get('/auth/me');
      setUser({ token: localStorage.getItem('token'), ...response.data });
    } catch (error) {
      console.error('Error fetching user:', error);
      // Token might be invalid, clear it
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    // Fetch full user details after login
    fetchCurrentUser();
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="app">
        <Header user={user} logout={logout} />
        <div>
          <Routes>
            <Route 
              path="/login" 
              element={!user ? <Login onLogin={login} /> : <Navigate to="/" />} 
            />
            <Route 
              path="/register" 
              element={!user ? <Register onLogin={login} /> : <Navigate to="/" />} 
            />
            <Route 
              path="/" 
              element={<ProductList user={user} />} 
            />
            <Route 
              path="/cart" 
              element={user ? <Cart /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/orders" 
              element={user ? <OrderHistory /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/admin" 
              element={user ? <AdminPanel /> : <Navigate to="/login" />} 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
