import React from 'react';

const AdminNotifications = () => {
  // Placeholder list - wire this to Firestore later if needed
  const notifications = [
    { id: 'n1', message: 'Example notification', time: 'Just now' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      <div className="bg-white rounded-lg shadow divide-y">
        {notifications.map(n => (
          <div key={n.id} className="p-4 flex items-center justify-between">
            <p className="text-gray-800">{n.message}</p>
            <span className="text-sm text-gray-500">{n.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminNotifications;


