import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import OrderSuccessPopup from '../../../components/OrderSuccessPopup';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderRef = doc(db, 'orders', orderId);
        const orderSnap = await getDoc(orderRef);
        
        if (orderSnap.exists()) {
          setOrder({
            id: orderSnap.id,
            ...orderSnap.data(),
            // Format the order data for the receipt
            orderId: `ORD-${orderSnap.id.substring(0, 5).toUpperCase()}`,
            items: orderSnap.data().items.map(item => ({
              ...item,
              name: item.name || 'Product',
              price: item.price || 0,
              quantity: item.quantity || 1
            })),
            subtotal: orderSnap.data().subtotal || 0,
            shipping: orderSnap.data().shipping || 0,
            total: orderSnap.data().total || 0,
            status: 'Completed'
          });
        } else {
          setError('Order not found');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleClose = () => {
    navigate('/products');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#484139]">
        <div className="text-white text-xl">Loading order details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#484139]">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#484139]">
      {order && (
        <OrderSuccessPopup 
          order={order} 
          onClose={handleClose} 
        />
      )}
    </div>
  );
};

export default OrderConfirmation;
