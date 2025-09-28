// Admin configuration
export const ADMIN_EMAILS = ['admin@gmail.com'];

// Utility function to check if an email is admin
export const isAdminEmail = (email) => {
  return ADMIN_EMAILS.includes(email);
};
