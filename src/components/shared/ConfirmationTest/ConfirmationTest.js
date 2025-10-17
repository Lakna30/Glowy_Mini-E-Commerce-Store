import React from 'react';
import { useConfirmation } from '../../../contexts/ConfirmationContext';

const ConfirmationTest = () => {
  const { showConfirmation } = useConfirmation();

  const handleTestConfirmations = async () => {
    // Test different types of confirmations
    const tests = [
      {
        title: 'Delete Product',
        message: 'Are you sure you want to delete this product? This action cannot be undone.',
        confirmText: 'Yes, Delete',
        cancelText: 'Cancel',
        type: 'danger'
      },
      {
        title: 'Logout',
        message: 'Are you sure you want to logout? You will need to sign in again.',
        confirmText: 'Yes, Logout',
        cancelText: 'Stay Logged In',
        type: 'logout'
      },
      {
        title: 'Cancel Order',
        message: 'Are you sure you want to cancel this order? You will receive a full refund.',
        confirmText: 'Yes, Cancel Order',
        cancelText: 'Keep Order',
        type: 'cancel'
      },
      {
        title: 'Information',
        message: 'This is an informational confirmation dialog.',
        confirmText: 'Got it',
        cancelText: 'Close',
        type: 'info'
      }
    ];

    for (const test of tests) {
      const result = await showConfirmation(test);
      console.log(`Confirmation result for ${test.title}:`, result);
      
      // Wait a bit between confirmations for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Confirmation Dialog Test</h2>
      <p className="text-gray-600 mb-4">
        Click the button below to test different types of confirmation dialogs.
      </p>
      <button
        onClick={handleTestConfirmations}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Test All Confirmation Types
      </button>
    </div>
  );
};

export default ConfirmationTest;
