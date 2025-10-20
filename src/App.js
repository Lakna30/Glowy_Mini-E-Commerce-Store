import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ConfirmationProvider } from './contexts/ConfirmationContext';
import { AdminNotificationsProvider } from './contexts/AdminNotificationsContext';

// User Pages
import Home from './pages/user/Home/Home';
import About from './pages/user/About/About';
import Login from './pages/user/Auth/Login';
import Signup from './pages/user/Auth/Signup';
import AllProducts from './pages/user/Products/AllProducts';
import Product from './pages/user/Products/Product';
import ShoppingCart from './pages/user/Cart/ShoppingCart';
import ConfirmOrder from './pages/user/Orders/ConfirmOrder';
import OrderConfirmation from './pages/user/Orders/OrderConfirmation';
import MyOrders from './pages/user/Orders/MyOrders';
import UserProfile from './pages/user/Profile/Profile';

// Admin Pages
import AdminHome from './pages/admin/Home/AdminHome';
import AddProduct from './pages/admin/Products/AddProduct';
import AdminProducts from './pages/admin/Products/AdminProducts';
import AdminProductView from './pages/admin/Products/AdminProductView';
import EditProduct from './pages/admin/Products/EditProduct';
import AdminOrders from './pages/admin/Orders/AdminOrders';
import AdminCustomers from './pages/admin/Customers/AdminCustomers';
import AdminReviews from './pages/admin/Reviews/AdminReviews';
import AdminNotifications from './pages/admin/Notifications/AdminNotifications';
import AdminProfile from './pages/admin/Profile/AdminProfile';

// Shared Components
import Navbar from './components/shared/Navbar/Navbar';
import Footer from './components/shared/Footer/Footer';
import ProtectedRoute from './components/shared/ProtectedRoute/ProtectedRoute';
import AdminRoute from './components/shared/AdminRoute/AdminRoute';
import AdminLayout from './components/shared/AdminLayout/AdminLayout';
import ContactUs from './pages/user/ContactUs/ContactUs';
import NotificationContainer from './components/shared/NotificationContainer/NotificationContainer';
import ConfirmationContainer from './components/shared/ConfirmationContainer/ConfirmationContainer';

// Layout component
const Layout = ({ children }) => {
  const location = useLocation();

  const noNavRoutes = ['/login', '/signup'];
  const noFooterRoutes = ['/login', '/signup', '/cart'];
  const adminRoutes = ['/admin', '/admin/add-product', '/admin/orders', '/admin/products', '/admin/reviews', '/admin/customers', '/admin/profile', '/admin/product', '/admin/edit-product'];

  const isAdminRoute = adminRoutes.some(route => location.pathname.startsWith(route));
  const showNavbar = !noNavRoutes.includes(location.pathname) && !isAdminRoute;
  const showFooter = !noFooterRoutes.includes(location.pathname) && !isAdminRoute;

  // Use AdminLayout for admin routes
  if (isAdminRoute) {
    return <AdminLayout>{children}</AdminLayout>;
  }

  return (
    <div className="App">
      {showNavbar && <Navbar />}
      <main>{children}</main>
      {showFooter && <Footer />}
      <NotificationContainer />
      <ConfirmationContainer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <NotificationProvider>
          <ConfirmationProvider>
            <AdminNotificationsProvider>
            <Router>
          <Layout>
            <Routes>
              {/* User Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/products" element={<AllProducts />} />
              <Route path="/product/:id" element={<Product />} />
              <Route path="/cart" element={<ShoppingCart />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route 
                path="/order-confirmation/:orderId" 
                element={
                  <ProtectedRoute>
                    <OrderConfirmation />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/confirm-order" 
                element={
                  <ProtectedRoute>
                    <ConfirmOrder />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-profile" 
                element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-orders" 
                element={
                  <ProtectedRoute>
                    <MyOrders />
                  </ProtectedRoute>
                } 
              />

              {/* Admin Routes */}
              <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <AdminHome />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/add-product" 
                element={
                  <AdminRoute>
                    <AddProduct />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/orders" 
                element={
                  <AdminRoute>
                    <AdminOrders />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/products" 
                element={
                  <AdminRoute>
                    <AdminProducts />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/product/:id" 
                element={
                  <AdminRoute>
                    <AdminProductView />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/edit-product/:id" 
                element={
                  <AdminRoute>
                    <EditProduct />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/customers" 
                element={
                  <AdminRoute>
                    <AdminCustomers />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/reviews" 
                element={
                  <AdminRoute>
                    <AdminReviews />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/profile" 
                element={
                  <AdminRoute>
                    <AdminProfile />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/notifications" 
                element={
                  <AdminRoute>
                    <AdminNotifications />
                  </AdminRoute>
                } 
              />
            </Routes>
          </Layout>
            </Router>
            </AdminNotificationsProvider>
          </ConfirmationProvider>
        </NotificationProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
