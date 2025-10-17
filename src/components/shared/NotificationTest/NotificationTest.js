import React from 'react';
import { useNotification } from '../../../contexts/NotificationContext';

const NotificationTest = () => {
  const { showSuccess, showError, showWarning, showInfo } = useNotification();

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Notification System Test</h2>
      <div className="space-x-2">
        <button
          onClick={() => showSuccess('Success! Operation completed successfully.')}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Success
        </button>
        <button
          onClick={() => showError('Error! Something went wrong.')}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Error
        </button>
        <button
          onClick={() => showWarning('Warning! Please check your input.')}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Warning
        </button>
        <button
          onClick={() => showInfo('Info! Here is some useful information.')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Info
        </button>
      </div>
    </div>
  );
};

export default NotificationTest;
