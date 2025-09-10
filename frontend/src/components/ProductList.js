import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProductList = ({ user }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
      searchProducts(searchTerm);
    }
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/products');
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async (term) => {
    try {
      const response = await axios.get(`/products/search?name=${term}`);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  const addToCart = async (productId) => {
    if (!user) {
      setMessage('Please login to add items to cart');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    try {
      await axios.post('/cart/add', {
        productId: productId,
        quantity: 1
      });
      setMessage('🎉 Product added to cart successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setMessage(error.response?.data?.message || '❌ Error adding product to cart');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌱</div>
          Loading fresh products...
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ color: '#2e7d32', fontSize: '2.5rem', fontWeight: '800', margin: 0 }}>
          🌿 Fresh Products
        </h2>
        {user && user.role === 'ADMIN' && (
          <Link to="/admin" className="btn btn-success" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
            ➕ Add New Product
          </Link>
        )}
      </div>
      
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search for eco-friendly products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {message && (
        <div className={message.includes('Error') || message.includes('❌') ? 'error' : 'success'}>
          {message}
        </div>
      )}

      {filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'rgba(255,255,255,0.9)', borderRadius: '20px', margin: '2rem 0' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
          <h3 style={{ color: '#2e7d32', marginBottom: '1rem' }}>No products found</h3>
          <p style={{ color: '#666' }}>Try adjusting your search terms or browse our full catalog</p>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              {product.imageUrl && (
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="product-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200/4caf50/ffffff?text=🌱+Product';
                  }}
                />
              )}
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-price">${product.price}</div>
                <div className="product-stock">
                  📦 Stock: {product.stock} {product.stock === 1 ? 'item' : 'items'}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                  {user && user.role !== 'ADMIN' && product.stock > 0 && (
                    <button 
                      className="btn btn-success" 
                      onClick={() => addToCart(product.id)}
                      style={{ flex: 1, fontSize: '1rem', fontWeight: '600' }}
                    >
                      🛒 Add to Cart
                    </button>
                  )}
                  {user && user.role !== 'ADMIN' && product.stock === 0 && (
                    <span style={{ 
                      color: '#d32f2f', 
                      fontWeight: '600', 
                      padding: '0.5rem 1rem', 
                      background: 'rgba(211, 47, 47, 0.1)', 
                      borderRadius: '20px',
                      flex: 1,
                      textAlign: 'center'
                    }}>
                      ❌ Out of Stock
                    </span>
                  )}
                  {user && user.role === 'ADMIN' && (
                    <span style={{ 
                      color: '#4caf50', 
                      fontWeight: '600',
                      padding: '0.5rem 1rem', 
                      background: 'rgba(76, 175, 80, 0.1)', 
                      borderRadius: '20px',
                      flex: 1,
                      textAlign: 'center'
                    }}>
                      ⚙️ Admin View
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;