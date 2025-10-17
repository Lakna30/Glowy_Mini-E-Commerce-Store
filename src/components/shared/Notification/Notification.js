import React from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const Notification = ({ notification, onClose }) => {
  if (!notification) return null;

  const { message, type, id } = notification;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 flex-shrink-0" />;
      case 'error':
        return <AlertCircle className="w-6 h-6 flex-shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6 flex-shrink-0" />;
      case 'info':
        return <Info className="w-6 h-6 flex-shrink-0" />;
      default:
        return <Info className="w-6 h-6 flex-shrink-0" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white border-green-600';
      case 'error':
        return 'bg-red-500 text-white border-red-600';
      case 'warning':
        return 'bg-yellow-500 text-white border-yellow-600';
      case 'info':
        return 'bg-blue-500 text-white border-blue-600';
      default:
        return 'bg-gray-500 text-white border-gray-600';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`flex items-center space-x-3 px-6 py-4 rounded-lg shadow-lg max-w-sm border ${getStyles()}`}>
        {getIcon()}
        <p className="text-sm font-medium flex-1">{message}</p>
        <button
          onClick={() => onClose(id)}
          className="ml-2 text-white hover:text-gray-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Notification;
