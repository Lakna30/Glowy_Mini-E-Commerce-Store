import React, { createContext, useContext, useState, useCallback } from 'react';

const ConfirmationContext = createContext();

export const useConfirmation = () => {
  const context = useContext(ConfirmationContext);
  if (!context) {
    throw new Error('useConfirmation must be used within a ConfirmationProvider');
  }
  return context;
};

export const ConfirmationProvider = ({ children }) => {
  const [confirmation, setConfirmation] = useState(null);

  const showConfirmation = useCallback((options) => {
    return new Promise((resolve) => {
      setConfirmation({
        ...options,
        onConfirm: () => {
          setConfirmation(null);
          resolve(true);
        },
        onCancel: () => {
          setConfirmation(null);
          resolve(false);
        }
      });
    });
  }, []);

  const closeConfirmation = useCallback(() => {
    setConfirmation(null);
  }, []);

  const value = {
    showConfirmation,
    closeConfirmation,
    confirmation
  };

  return (
    <ConfirmationContext.Provider value={value}>
      {children}
    </ConfirmationContext.Provider>
  );
};
