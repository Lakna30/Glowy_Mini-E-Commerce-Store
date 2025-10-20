import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';

const AdminNotificationsContext = createContext();

export const useAdminNotifications = () => {
  const ctx = useContext(AdminNotificationsContext);
  if (!ctx) throw new Error('useAdminNotifications must be used within AdminNotificationsProvider');
  return ctx;
};

export const AdminNotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    { id: 'n1', message: 'New order received', time: '2 min ago', unread: true },
    { id: 'n2', message: 'Product review pending', time: '1 hour ago', unread: true },
    { id: 'n3', message: 'Low stock alert', time: '3 hours ago', unread: false },
  ]);

  const markAsRead = useCallback((id) => {
    setNotifications((prev) => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map(n => ({ ...n, unread: false })));
  }, []);

  const unreadCount = useMemo(() => notifications.filter(n => n.unread).length, [notifications]);

  const value = useMemo(() => ({ notifications, markAsRead, markAllAsRead, unreadCount }), [notifications, markAsRead, markAllAsRead, unreadCount]);

  return (
    <AdminNotificationsContext.Provider value={value}>
      {children}
    </AdminNotificationsContext.Provider>
  );
};


