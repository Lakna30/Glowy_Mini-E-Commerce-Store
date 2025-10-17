import React from 'react';
import { useConfirmation } from '../../../contexts/ConfirmationContext';
import ConfirmationDialog from '../ConfirmationDialog/ConfirmationDialog';

const ConfirmationContainer = () => {
  const { confirmation, closeConfirmation } = useConfirmation();

  if (!confirmation) return null;

  return (
    <ConfirmationDialog
      isOpen={!!confirmation}
      onClose={closeConfirmation}
      onConfirm={confirmation.onConfirm}
      title={confirmation.title}
      message={confirmation.message}
      confirmText={confirmation.confirmText}
      cancelText={confirmation.cancelText}
      type={confirmation.type}
      isLoading={confirmation.isLoading}
    />
  );
};

export default ConfirmationContainer;
