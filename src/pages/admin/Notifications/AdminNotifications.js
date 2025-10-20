import React from 'react';
import { Check } from 'lucide-react';
import { useAdminNotifications } from '../../../contexts/AdminNotificationsContext';

const AdminNotifications = () => {
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useAdminNotifications();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <button
          onClick={markAllAsRead}
          className="text-sm text-[#DDBB92] hover:text-[#B8A082]"
        >
          Mark all as read {unreadCount > 0 ? `(${unreadCount})` : ''}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow divide-y">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No notifications</div>
        ) : (
          notifications.map(n => (
            <div key={n.id} className={`p-4 flex items-center justify-between ${n.unread ? 'bg-blue-50' : ''}`}>
              <div>
                <p className="text-gray-800">{n.message}</p>
                <span className="text-sm text-gray-500">{n.time}</span>
              </div>
              {n.unread ? (
                <button
                  onClick={() => markAsRead(n.id)}
                  className="text-green-600 hover:text-green-800"
                  title="Mark as read"
                >
                  <Check className="w-4 h-4" />
                </button>
              ) : (
                <span className="text-xs text-gray-400">Read</span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;



