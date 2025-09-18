import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, limit } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { useAuth } from '../../../contexts/AuthContext';

const MyOrders = () => {
  const { currentUser } = useAuth();
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      if (!currentUser) return;

      try {
        const ordersRef = collection(db, 'orders');
        const q = query(
          ordersRef,
          where('userId', '==', currentUser.uid),
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        
        const querySnapshot = await getDocs(q);
        const ordersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setRecentOrders(ordersData);
      } catch (error) {
        console.error('Error fetching recent orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentOrders();
  }, [currentUser]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'processing': return '#17a2b8';
      case 'shipped': return '#007bff';
      case 'delivered': return '#28a745';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading">Loading your orders...</div>;
  }

  return (
    <div className="my-orders">
      <div className="container mx-auto px-4 py-8">
        <div className="page-header">
          <h1>My Orders</h1>
          <p>Quick overview of your recent orders</p>
        </div>

        <div className="orders-overview">
          {recentOrders.length > 0 ? (
            <>
              <div className="recent-orders">
                <h2>Recent Orders</h2>
                <div className="orders-grid">
                  {recentOrders.map(order => (
                    <div key={order.id} className="order-card">
                      <div className="order-header">
                        <div className="order-number">
                          #{order.orderNumber || order.id.slice(-8)}
                        </div>
                        <div 
                          className="order-status"
                          style={{ backgroundColor: getStatusColor(order.status) }}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </div>
                      </div>
                      
                      <div className="order-date">
                        {formatDate(order.createdAt)}
                      </div>
                      
                      <div className="order-items-count">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </div>
                      
                      <div className="order-total">
                        ${order.total?.toFixed(2) || '0.00'}
                      </div>
                      
                      <div className="order-preview">
                        {order.items.slice(0, 2).map((item, index) => (
                          <div key={index} className="preview-item">
                            <img 
                              src={item.imageUrl || '/placeholder-product.jpg'} 
                              alt={item.name}
                            />
                            <span>{item.name}</span>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <div className="more-items">
                            +{order.items.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="actions-grid">
                  <a href="/order-history" className="action-card">
                    <div className="action-icon">📋</div>
                    <h3>View All Orders</h3>
                    <p>See your complete order history</p>
                  </a>
                  
                  <a href="/products" className="action-card">
                    <div className="action-icon">🛍️</div>
                    <h3>Continue Shopping</h3>
                    <p>Browse our latest products</p>
                  </a>
                  
                  <a href="/cart" className="action-card">
                    <div className="action-icon">🛒</div>
                    <h3>Shopping Cart</h3>
                    <p>Review items in your cart</p>
                  </a>
                </div>
              </div>
            </>
          ) : (
            <div className="no-orders">
              <div className="no-orders-content">
                <div className="no-orders-icon">📦</div>
                <h2>No Orders Yet</h2>
                <p>You haven't placed any orders yet. Start shopping to see your orders here!</p>
                <a href="/products" className="start-shopping-btn">
                  Start Shopping
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
