// ID Generator utility for custom prefixes
export const generateId = (prefix) => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${prefix}-${timestamp}${randomStr}`.toUpperCase();
};

// Specific generators for different entities
export const generateUserId = () => generateId('U');
export const generateProductId = () => generateId('P');
export const generateOrderId = () => generateId('O');
