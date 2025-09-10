import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    imageUrl: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (activeTab === 'products') {
      fetchProducts();
    } else if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/admin/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/admin/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setMessage('❌ Error fetching orders. Make sure you have admin privileges.');
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await axios.put(`/admin/products/${editingProduct.id}`, productForm);
        setMessage('✅ Product updated successfully!');
      } else {
        await axios.post('/admin/products', productForm);
        setMessage('✅ Product created successfully!');
      }
      
      resetProductForm();
      fetchProducts();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving product:', error);
      setMessage('❌ Error saving product. Make sure you have admin privileges.');
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const editProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      imageUrl: product.imageUrl || ''
    });
    setShowProductModal(true);
  };

  const deleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await axios.delete(`/admin/products/${productId}`);
        if (response.data && response.data.message) {
          setMessage(`✅ ${response.data.message}`);
        } else {
          setMessage('✅ Product deleted successfully!');
        }
        fetchProducts();
        setTimeout(() => setMessage(''), 5000);
      } catch (error) {
        console.error('Delete error:', error);
        const errorMessage = error.response?.data?.message || 
                           error.response?.data || 
                           `❌ Error deleting product: ${error.message}`;
        setMessage(errorMessage);
        setTimeout(() => setMessage(''), 5000);
      }
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`/admin/orders/${orderId}/status`, null, {
        params: { status }
      });
      setMessage(`✅ Order status updated to ${status}!`);
      fetchOrders();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating order status:', error);
      setMessage('❌ Error updating order status.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const resetProductForm = () => {
    setProductForm({
      name: '',
      description: '',
      price: '',
      stock: '',
      imageUrl: ''
    });
    setEditingProduct(null);
    setShowProductModal(false);
  };

  const handleInputChange = (e) => {
    setProductForm({
      ...productForm,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container">
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ color: '#2e7d32', fontSize: '3rem', fontWeight: '800', marginBottom: '1rem' }}>
          ⚙️ Admin Dashboard
        </h1>
        <p style={{ color: '#666', fontSize: '1.2rem' }}>Manage your eco-friendly store</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem', gap: '1rem', flexWrap: 'wrap' }}>
        <button
          className={`btn ${activeTab === 'products' ? 'btn-success' : ''}`}
          onClick={() => setActiveTab('products')}
          style={{ 
            padding: '1rem 2rem', 
            fontSize: '1.1rem',
            background: activeTab === 'products' ? 'linear-gradient(135deg, #2e7d32, #4caf50)' : 'rgba(255,255,255,0.9)',
            color: activeTab === 'products' ? 'white' : '#2e7d32'
          }}
        >
          📦 Products
        </button>
        <button
          className={`btn ${activeTab === 'orders' ? 'btn-success' : ''}`}
          onClick={() => setActiveTab('orders')}
          style={{ 
            padding: '1rem 2rem', 
            fontSize: '1.1rem',
            background: activeTab === 'orders' ? 'linear-gradient(135deg, #2e7d32, #4caf50)' : 'rgba(255,255,255,0.9)',
            color: activeTab === 'orders' ? 'white' : '#2e7d32'
          }}
        >
          📋 Orders
        </button>
      </div>

      {message && (
        <div className={message.includes('❌') ? 'error' : 'success'} style={{ marginBottom: '2rem' }}>
          {message}
        </div>
      )}

      {activeTab === 'products' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ color: '#2e7d32', fontSize: '2rem', fontWeight: '700' }}>🌱 Product Management</h2>
            <button
              className="btn btn-success"
              onClick={() => setShowProductModal(true)}
              style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}
            >
              ➕ Add New Product
            </button>
          </div>

          {showProductModal && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000
            }}>
              <div className="form-container" style={{ width: '500px', maxHeight: '90vh', overflow: 'auto' }}>
                <h3 style={{ color: '#2e7d32', marginBottom: '2rem' }}>
                  {editingProduct ? '✏️ Edit Product' : '➕ Add New Product'}
                </h3>
                <form onSubmit={handleProductSubmit}>
                  <div className="form-group">
                    <label>Product Name</label>
                    <input
                      type="text"
                      name="name"
                      value={productForm.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={productForm.description}
                      onChange={handleInputChange}
                      rows="3"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Price ($)</label>
                    <input
                      type="number"
                      name="price"
                      value={productForm.price}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Stock</label>
                    <input
                      type="number"
                      name="stock"
                      value={productForm.stock}
                      onChange={handleInputChange}
                      min="0"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Image URL</label>
                    <input
                      type="url"
                      name="imageUrl"
                      value={productForm.imageUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      className="btn"
                      onClick={resetProductForm}
                      style={{ background: '#666' }}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-success">
                      {editingProduct ? 'Update' : 'Create'} Product
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td>
                      {product.imageUrl && (
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/60x60/4caf50/ffffff?text=🌱';
                          }}
                        />
                      )}
                    </td>
                    <td>
                      <strong>{product.name}</strong>
                      <br />
                      <small style={{ color: '#666' }}>{product.description}</small>
                    </td>
                    <td style={{ fontWeight: '600', color: '#4caf50' }}>${product.price}</td>
                    <td style={{ fontWeight: '600' }}>{product.stock}</td>
                    <td>
                      <span className={`badge ${product.active !== false ? 'badge-delivered' : 'badge-cancelled'}`}>
                        {product.active !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn"
                        onClick={() => editProduct(product)}
                        style={{ marginRight: '0.5rem', background: '#4caf50' }}
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        className="btn btn-danger"
                        onClick={() => deleteProduct(product.id)}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div>
          <h2 style={{ color: '#2e7d32', fontSize: '2rem', fontWeight: '700', marginBottom: '2rem' }}>
            📋 Order Management
          </h2>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: '600' }}>#{order.id}</td>
                    <td>{order.user.username}</td>
                    <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td style={{ fontWeight: '600', color: '#4caf50' }}>${order.totalAmount}</td>
                    <td>
                      <span className={`badge badge-${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        style={{
                          padding: '0.5rem',
                          borderRadius: '8px',
                          border: '2px solid #c8e6c9',
                          background: 'white'
                        }}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;