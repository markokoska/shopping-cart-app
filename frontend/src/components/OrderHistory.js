import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'badge-pending';
      case 'confirmed': return 'badge-confirmed';
      case 'shipped': return 'badge-shipped';
      case 'delivered': return 'badge-delivered';
      case 'cancelled': return 'badge-cancelled';
      default: return 'badge-pending';
    }
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <div>
      <h2>Order History</h2>

      {orders.length === 0 ? (
        <div className="empty-state">
          <h3>No orders found</h3>
          <p>You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div>
          {orders.map(order => (
            <div key={order.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <h3>Order #{order.id}</h3>
                  <p>Placed on: {formatDate(order.orderDate)}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                    {order.status}
                  </span>
                  <div style={{ marginTop: '0.5rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
                    ${order.totalAmount}
                  </div>
                </div>
              </div>
              
              {order.orderItems && order.orderItems.length > 0 && (
                <div>
                  <h4>Items:</h4>
                  {order.orderItems.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                      <div>
                        <strong>{item.product.name}</strong>
                        <span style={{ marginLeft: '1rem', color: '#7f8c8d' }}>
                          Qty: {item.quantity}
                        </span>
                      </div>
                      <div>${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
