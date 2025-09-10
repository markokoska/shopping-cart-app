import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ user, logout }) => {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="logo">🛒 EcoShop</h1>
        <nav>
          <div className="nav-links">
            {user ? (
              <>
                <Link to="/">🏠 Products</Link>
                {user.role !== 'ADMIN' && <Link to="/cart">🛒 Cart</Link>}
                {user.role !== 'ADMIN' && <Link to="/orders">📋 My Orders</Link>}
                {user.role === 'ADMIN' && <Link to="/admin">⚙️ Admin Panel</Link>}
                <span style={{ color: '#ffffff', marginRight: '1rem', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', fontWeight: '600' }}>
                  👤 {user.username} ({user.role})
                </span>
                <button className="btn" onClick={logout}>🚪 Logout</button>
              </>
            ) : (
              <>
                <Link to="/login">🔑 Login</Link>
                <Link to="/register">📝 Register</Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;