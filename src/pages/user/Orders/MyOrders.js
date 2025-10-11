import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { useAuth } from '../../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { ChevronLeft, X } from 'lucide-react';

const MyOrders = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) return;

      try {
        const ordersRef = collection(db, 'orders');
        const q = query(
          ordersRef,
          where('userId', '==', currentUser.uid)
        );
        
        const querySnapshot = await getDocs(q);
        const ordersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Sort by creation date in JavaScript instead of Firestore
        ordersData.sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
          return dateB - dateA; // Newest first
        });
        
        setOrders(ordersData);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'success':
      case 'delivered': 
        return 'bg-green-100 text-green-800';
      case 'processing': 
        return 'bg-blue-100 text-blue-800';
      case 'cancelled': 
        return 'bg-red-100 text-red-800';
      case 'pending': 
        return 'bg-yellow-100 text-yellow-800';
      default: 
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatOrderId = (id) => {
    return `ORD-${id.slice(-5).toUpperCase()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#B8A082] flex items-center justify-center">
        <div className="text-[#2B2A29] text-lg">Loading your orders...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#484139]">

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-8 pt-8">
        {/* Header */}
        <div className="bg-[#9A8771] rounded-t-2xl px-8 py-6">
          <h1 className="text-3xl font-bold text-white mb-2">My Orders</h1>
          <p className="text-[#E3D2BD]">View and edit all your pending, delivered and returned orders here</p>
        </div>

        {/* Orders Table */}
        <div className="bg-[#E3D5C5] rounded-b-2xl overflow-hidden">
          {orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#E3D2BD]">
                  <tr className="border-b border-[#B8A082]">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#2B2A29]">Order ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#2B2A29]">Order Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#2B2A29]">Order Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#2B2A29]">Order Price</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-[#2B2A29]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={order.id} className="border-b border-[#B8A082]">
                      <td className="px-6 py-4 text-sm text-[#2B2A29] font-medium">
                        {formatOrderId(order.id)}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#2B2A29]">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#2B2A29] font-semibold">
                        LKR {order.total?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="bg-[#DDBB92] hover:bg-[#d4b998] text-[#2B2A29] px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-[#2B2A29] mb-2">No Orders Yet</h3>
              <p className="text-[#2B2A29] mb-6">
                You haven't placed any orders yet. Start shopping to see your orders here!
              </p>
              <Link 
                to="/products" 
                className="inline-block bg-[#DDBB92] hover:bg-[#d4b998] text-[#2B2A29] px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#E3D5C5] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            {/* Close Button */}
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-[#2B2A29] hover:text-red-50 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Header */}
            <div className="bg-[#9A8771] rounded-t-2xl px-8 py-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                Order Details - {formatOrderId(selectedOrder.id)}
              </h2>
              <p className="text-[#E3D2BD]">
                Order placed on {formatDate(selectedOrder.createdAt)}
              </p>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Order Information */}
                <div>
                  <h3 className="text-lg font-semibold text-[#2B2A29] mb-4">Order Information</h3>
                  <div className="space-y-3 text-sm text-[#2B2A29]">
                    <div className="flex justify-between">
                      <span className="font-medium">Order ID:</span>
                      <span>{formatOrderId(selectedOrder.id)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Order Date:</span>
                      <span>{formatDate(selectedOrder.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Status:</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status?.charAt(0).toUpperCase() + selectedOrder.status?.slice(1) || 'Pending'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Total Amount:</span>
                      <span className="font-semibold">LKR {selectedOrder.total?.toFixed(2) || '0.00'}</span>
                    </div>
                  </div>
                </div>

                {/* Shipping Information */}
                <div>
                  <h3 className="text-lg font-semibold text-[#2B2A29] mb-4">Shipping Information</h3>
                  <div className="text-sm text-[#2B2A29] space-y-1">
                    <p className="font-medium">
                      {selectedOrder.shippingAddress?.firstName} {selectedOrder.shippingAddress?.lastName}
                    </p>
                    <p>{selectedOrder.shippingAddress?.address}</p>
                    <p>
                      {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode}
                    </p>
                    <p>{selectedOrder.shippingAddress?.country}</p>
                    <p className="font-medium">Phone: {selectedOrder.shippingAddress?.phone}</p>
                    <p className="font-medium">Email: {selectedOrder.shippingAddress?.email}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-semibold text-[#2B2A29] mb-4">Order Items</h3>
                <div className="space-y-4">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-[#D4C4A8] rounded-xl">
                      <img
                        src={item.imageUrl || '/placeholder-product.jpg'}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-[#2B2A29]">{item.name}</h4>
                        <p className="text-sm text-[#2B2A29] opacity-80">
                          Quantity: {item.quantity}
                          {item.selectedSize && ` • Size: ${item.selectedSize}`}
                          {item.selectedColor && ` • Color: ${item.selectedColor}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#2B2A29]">
                          LKR {(item.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-sm text-[#2B2A29] opacity-80">
                          LKR {item.price.toFixed(2)} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="mt-8 p-6 bg-[#D4C4A8] rounded-xl">
                <h3 className="text-lg font-semibold text-[#2B2A29] mb-4">Order Summary</h3>
                <div className="space-y-2 text-sm text-[#2B2A29]">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>LKR {selectedOrder.subtotal?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>LKR {selectedOrder.shipping?.toFixed(2) || '350.00'}</span>
                  </div>
                  <hr className="border-[#B8A082]" />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>LKR {selectedOrder.total?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex gap-4 justify-center">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="bg-[#DDBB92] hover:bg-[#d4b998] text-[#2B2A29] px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Close
                </button>
                {selectedOrder.status === 'delivered' && (
                  <button className="bg-[#9A8771] hover:bg-[#8B7355] text-white px-6 py-3 rounded-xl font-medium transition-colors">
                    Reorder
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
