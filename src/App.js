import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

// User Pages
import Home from './pages/user/Home/Home';
import Login from './pages/user/Auth/Login';
import Signup from './pages/user/Auth/Signup';
import AllProducts from './pages/user/Products/AllProducts';
import Product from './pages/user/Products/Product';
import ShoppingCart from './pages/user/Cart/ShoppingCart';
import ConfirmOrder from './pages/user/Orders/ConfirmOrder';
import OrderHistory from './pages/user/Orders/OrderHistory';
import MyOrders from './pages/user/Orders/MyOrders';

// Admin Pages
import AdminHome from './pages/admin/Home/AdminHome';
import AddProduct from './pages/admin/Products/AddProduct';
import AdminOrders from './pages/admin/Orders/AdminOrders';

// Shared Components
import Navbar from './components/shared/Navbar/Navbar';
import Footer from './components/shared/Footer/Footer';
import ProtectedRoute from './components/shared/ProtectedRoute/ProtectedRoute';
import AdminRoute from './components/shared/AdminRoute/AdminRoute';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Navbar />
            <main>
              <Routes>
                {/* User Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/products" element={<AllProducts />} />
                <Route path="/product/:id" element={<Product />} />
                <Route path="/cart" element={<ShoppingCart />} />
                <Route 
                  path="/confirm-order" 
                  element={
                    <ProtectedRoute>
                      <ConfirmOrder />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/order-history" 
                  element={
                    <ProtectedRoute>
                      <OrderHistory />
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
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
