import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get('/cart');
      setCartItems(response.data);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }

    try {
      await axios.put(`/cart/${itemId}`, { quantity: newQuantity });
      fetchCartItems();
    } catch (error) {
      setMessage('Error updating quantity');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const removeItem = async (itemId) => {
    try {
      await axios.delete(`/cart/${itemId}`);
      fetchCartItems();
    } catch (error) {
      setMessage('Error removing item');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const checkout = async () => {
    try {
      await axios.post('/orders/checkout');
      setMessage('Order placed successfully!');
      fetchCartItems();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error placing order');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0).toFixed(2);
  };

  if (loading) {
    return <div className="loading">Loading cart...</div>;
  }

  return (
    <div>
      <h2>Shopping Cart</h2>

      {message && (
        <div className={message.includes('Error') ? 'error' : 'success'}>
          {message}
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="empty-state">
          <h3>Your cart is empty</h3>
          <p>Add some products to get started!</p>
        </div>
      ) : (
        <div className="card">
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-details">
                <h4>{item.product.name}</h4>
                <p>${item.product.price} each</p>
              </div>
              <div className="cart-item-controls">
                <div className="quantity-controls">
                  <button 
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span style={{ margin: '0 10px' }}>{item.quantity}</span>
                  <button 
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <div style={{ marginLeft: '1rem' }}>
                  ${(item.product.price * item.quantity).toFixed(2)}
                </div>
                <button 
                  className="btn btn-danger"
                  onClick={() => removeItem(item.id)}
                  style={{ marginLeft: '1rem' }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          
          <div style={{ borderTop: '2px solid #eee', paddingTop: '1rem', marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Total: ${getTotalPrice()}</h3>
              <button className="btn btn-success" onClick={checkout}>
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
