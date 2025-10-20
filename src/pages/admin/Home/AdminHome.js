import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import jsPDF from 'jspdf';
import { Download, Calendar } from 'lucide-react';
import { isAdminEmail } from '../../../constants/admin';

const AdminHome = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({
    orders: [],
    users: []
  });
  const [timeFilter, setTimeFilter] = useState('monthly');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch orders
        const ordersRef = collection(db, 'orders');
        const ordersSnapshot = await getDocs(ordersRef);
        const ordersData = ordersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        console.log('Fetched orders data:', ordersData.length, 'orders');
        console.log('Sample order data:', ordersData.slice(0, 2));

        // Fetch products
        const productsRef = collection(db, 'products');
        const productsSnapshot = await getDocs(productsRef);

        // Fetch users (excluding admins)
        const usersRef = collection(db, 'users');
        const usersSnapshot = await getDocs(usersRef);
        const usersData = usersSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(user => !isAdminEmail(user.email) && user.role !== 'admin');
        
        console.log('Fetched users data:', usersData.length, 'users');
        console.log('Sample user data:', usersData.slice(0, 2));
        
        // If users don't have creation dates, we'll show them in the current month
        const usersWithoutDates = usersData.filter(user => {
          const userDateField = user.createdAt || user.created_at || user.joinedAt || user.joined_at || user.timestamp;
          return !userDateField;
        });
        console.log('Users without creation dates:', usersWithoutDates.length);

        // Calculate stats
        const totalOrders = ordersData.length;
        const totalProducts = productsSnapshot.size;
        const totalRevenue = ordersData.reduce((sum, order) => sum + (order.total || 0), 0);
        const pendingOrders = ordersData.filter(order => order.status === 'pending').length;

        setStats({
          totalOrders,
          totalProducts,
          totalRevenue,
          pendingOrders
        });

        // Get recent orders
        const recentOrdersData = ordersData
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        setRecentOrders(recentOrdersData);

        // Generate chart data
        generateChartData(ordersData, usersData);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeFilter]);

  const generateChartData = (ordersData, usersData) => {
    const now = new Date();
    let ordersChartData = [];
    let usersChartData = [];

    console.log('Generating chart data:', { ordersData: ordersData.length, usersData: usersData.length, timeFilter });

    if (timeFilter === 'weekly') {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayOrders = ordersData.filter(order => {
          if (!order.createdAt) return false;
          try {
            const orderDate = order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
            if (isNaN(orderDate.getTime())) return false;
            return orderDate.toISOString().split('T')[0] === dateStr;
          } catch (error) {
            console.warn('Invalid order date:', order.createdAt);
            return false;
          }
        });

        const dayUsers = usersData.filter(user => {
          // Try different possible date fields
          const userDateField = user.createdAt || user.created_at || user.joinedAt || user.joined_at || user.timestamp;
          if (!userDateField) {
            // If no date field, show in current day for weekly view
            if (timeFilter === 'weekly') {
              const today = new Date().toISOString().split('T')[0];
              return dateStr === today;
            }
            return false;
          }
          try {
            const userDate = userDateField?.toDate ? userDateField.toDate() : new Date(userDateField);
            if (isNaN(userDate.getTime())) return false;
            return userDate.toISOString().split('T')[0] === dateStr;
          } catch (error) {
            console.warn('Invalid user date:', userDateField);
            return false;
          }
        });

        ordersChartData.push({
          period: date.toLocaleDateString('en-US', { weekday: 'short' }),
          orders: dayOrders.length,
          revenue: dayOrders.reduce((sum, order) => sum + (order.total || 0), 0)
        });

        usersChartData.push({
          period: date.toLocaleDateString('en-US', { weekday: 'short' }),
          users: dayUsers.length
        });
      }
    } else if (timeFilter === 'monthly') {
      // Last 12 months
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthStr = date.toISOString().substring(0, 7);
        
        console.log(`Processing month ${i}: ${monthStr}`);
        
        const monthOrders = ordersData.filter(order => {
          if (!order.createdAt) return false;
          try {
            const orderDate = order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
            if (isNaN(orderDate.getTime())) return false;
            const orderMonthStr = orderDate.toISOString().substring(0, 7);
            const matches = orderMonthStr === monthStr;
            if (matches) {
              console.log(`Order found for ${monthStr}:`, order.id);
            }
            return matches;
          } catch (error) {
            console.warn('Invalid order date:', order.createdAt);
            return false;
          }
        });

        const monthUsers = usersData.filter(user => {
          // Try different possible date fields
          const userDateField = user.createdAt || user.created_at || user.joinedAt || user.joined_at || user.timestamp;
          if (!userDateField) {
            // If no date field, show in current month for monthly view
            const currentMonth = new Date().toISOString().substring(0, 7);
            const matches = monthStr === currentMonth;
            if (matches) {
              console.log(`User without date found for current month ${monthStr}:`, user.id);
            }
            return matches;
          }
          try {
            const userDate = userDateField?.toDate ? userDateField.toDate() : new Date(userDateField);
            if (isNaN(userDate.getTime())) return false;
            const userMonthStr = userDate.toISOString().substring(0, 7);
            const matches = userMonthStr === monthStr;
            if (matches) {
              console.log(`User found for ${monthStr}:`, user.id);
            }
            return matches;
          } catch (error) {
            console.warn('Invalid user date:', userDateField);
            return false;
          }
        });

        const monthData = {
          period: date.toLocaleDateString('en-US', { month: 'short' }),
          orders: monthOrders.length,
          revenue: monthOrders.reduce((sum, order) => sum + (order.total || 0), 0)
        };

        const userData = {
          period: date.toLocaleDateString('en-US', { month: 'short' }),
          users: monthUsers.length
        };

        console.log(`Month ${monthStr} data:`, monthData, userData);

        ordersChartData.push(monthData);
        usersChartData.push(userData);
      }
    } else if (timeFilter === 'yearly') {
      // Last 5 years
      for (let i = 4; i >= 0; i--) {
        const year = now.getFullYear() - i;
        
        const yearOrders = ordersData.filter(order => {
          if (!order.createdAt) return false;
          try {
            const orderDate = order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
            if (isNaN(orderDate.getTime())) return false;
            return orderDate.getFullYear() === year;
          } catch (error) {
            console.warn('Invalid order date:', order.createdAt);
            return false;
          }
        });

        const yearUsers = usersData.filter(user => {
          // Try different possible date fields
          const userDateField = user.createdAt || user.created_at || user.joinedAt || user.joined_at || user.timestamp;
          if (!userDateField) {
            // If no date field, show in current year for yearly view
            if (timeFilter === 'yearly') {
              const currentYear = new Date().getFullYear();
              return year === currentYear;
            }
            return false;
          }
          try {
            const userDate = userDateField?.toDate ? userDateField.toDate() : new Date(userDateField);
            if (isNaN(userDate.getTime())) return false;
            return userDate.getFullYear() === year;
          } catch (error) {
            console.warn('Invalid user date:', userDateField);
            return false;
          }
        });

        ordersChartData.push({
          period: year.toString(),
          orders: yearOrders.length,
          revenue: yearOrders.reduce((sum, order) => sum + (order.total || 0), 0)
        });

        usersChartData.push({
          period: year.toString(),
          users: yearUsers.length
        });
      }
    }

    // Add fallback data if no data exists
    if (ordersChartData.length === 0) {
      console.log('No orders data found, using fallback data for', timeFilter);
      if (timeFilter === 'weekly') {
        ordersChartData = [
          { period: 'Mon', orders: 2, revenue: 1500 },
          { period: 'Tue', orders: 1, revenue: 800 },
          { period: 'Wed', orders: 3, revenue: 2200 },
          { period: 'Thu', orders: 0, revenue: 0 },
          { period: 'Fri', orders: 4, revenue: 3200 },
          { period: 'Sat', orders: 2, revenue: 1800 },
          { period: 'Sun', orders: 1, revenue: 900 }
        ];
      } else if (timeFilter === 'monthly') {
        ordersChartData = [
          { period: 'Jan', orders: 1, revenue: 500 },
          { period: 'Feb', orders: 0, revenue: 0 },
          { period: 'Mar', orders: 2, revenue: 1200 },
          { period: 'Apr', orders: 0, revenue: 0 },
          { period: 'May', orders: 1, revenue: 800 },
          { period: 'Jun', orders: 0, revenue: 0 },
          { period: 'Jul', orders: 0, revenue: 0 },
          { period: 'Aug', orders: 0, revenue: 0 },
          { period: 'Sep', orders: 0, revenue: 0 },
          { period: 'Oct', orders: 0, revenue: 0 },
          { period: 'Nov', orders: 0, revenue: 0 },
          { period: 'Dec', orders: 0, revenue: 0 }
        ];
      } else {
        ordersChartData = [
          { period: '2021', orders: 120, revenue: 95000 },
          { period: '2022', orders: 180, revenue: 142000 },
          { period: '2023', orders: 220, revenue: 175000 },
          { period: '2024', orders: 280, revenue: 225000 },
          { period: '2025', orders: 150, revenue: 120000 }
        ];
      }
    }
    
    // Use real user data if available, otherwise show sample data
    if (usersChartData.length === 0) {
      if (timeFilter === 'weekly') {
        usersChartData = [
          { period: 'Mon', users: 0 },
          { period: 'Tue', users: 0 },
          { period: 'Wed', users: 0 },
          { period: 'Thu', users: 0 },
          { period: 'Fri', users: 0 },
          { period: 'Sat', users: 0 },
          { period: 'Sun', users: 0 }
        ];
      } else if (timeFilter === 'monthly') {
        usersChartData = [
          { period: 'Jan', users: 0 },
          { period: 'Feb', users: 0 },
          { period: 'Mar', users: 0 },
          { period: 'Apr', users: 0 },
          { period: 'May', users: 0 },
          { period: 'Jun', users: 0 },
          { period: 'Jul', users: 0 },
          { period: 'Aug', users: 0 },
          { period: 'Sep', users: 0 },
          { period: 'Oct', users: 0 },
          { period: 'Nov', users: 0 },
          { period: 'Dec', users: 0 }
        ];
      } else {
        usersChartData = [
          { period: '2021', users: 0 },
          { period: '2022', users: 0 },
          { period: '2023', users: 0 },
          { period: '2024', users: 0 },
          { period: '2025', users: 0 }
        ];
      }
    }

    console.log('Final chart data:', { ordersChartData, usersChartData });
    console.log('Users data length:', usersChartData.length);
    console.log('Users data sample:', usersChartData.slice(0, 2));
    console.log('Orders data length:', ordersChartData.length);
    console.log('Orders data sample:', ordersChartData.slice(0, 2));

    setChartData({
      orders: ordersChartData,
      users: usersChartData
    });
  };

  const downloadOrderReport = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text('Monthly Order Report', 14, 22);
    
    // Date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);
    
    // Get monthly data
    const monthlyData = chartData.orders;
    
    // Table headers
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Period', 14, 50);
    doc.text('Orders', 60, 50);
    doc.text('Revenue (LKR)', 100, 50);
    
    // Draw line under headers
    doc.line(14, 52, 190, 52);
    
    // Table data
    let yPosition = 60;
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    
    monthlyData.forEach((item, index) => {
      // Alternate row colors
      if (index % 2 === 0) {
        doc.setFillColor(245, 245, 245);
        doc.rect(14, yPosition - 3, 176, 8, 'F');
      }
      
      doc.text(item.period, 14, yPosition);
      doc.text(item.orders.toString(), 60, yPosition);
      doc.text(item.revenue.toFixed(2), 100, yPosition);
      yPosition += 8;
    });
    
    // Summary
    const totalOrders = monthlyData.reduce((sum, item) => sum + item.orders, 0);
    const totalRevenue = monthlyData.reduce((sum, item) => sum + item.revenue, 0);
    
    yPosition += 10;
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`Total Orders: ${totalOrders}`, 14, yPosition);
    doc.text(`Total Revenue: LKR ${totalRevenue.toFixed(2)}`, 14, yPosition + 10);
    
    // Save the PDF
    doc.save(`order-report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="admin-home">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-home">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your store.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">LKR {stats.totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pendingOrders}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
            <div className="flex items-center space-x-4">
              {/* Time Filter */}
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#DDBB92]"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              
              {/* Download Report Button */}
              <button
                onClick={downloadOrderReport}
                className="flex items-center space-x-2 bg-[#DDBB92] text-[#2B2A29] px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download Report</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Orders Area Chart */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Orders & Revenue</h3>
              <div style={{ width: '100%', height: '300px', minHeight: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData.orders}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'orders' ? value : `LKR ${value.toFixed(2)}`,
                        name === 'orders' ? 'Orders' : 'Revenue'
                      ]}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="orders" 
                      stackId="1" 
                      stroke="#DDBB92" 
                      fill="#DDBB92" 
                      fillOpacity={0.6}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stackId="2" 
                      stroke="#8B7355" 
                      fill="#8B7355" 
                      fillOpacity={0.4}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Users Bar Chart */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">New Users</h3>
              <div style={{ width: '100%', height: '300px', minHeight: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.users}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="users" fill="#DDBB92" stroke="#8B7355" strokeWidth={1} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Recent Orders</h2>
              <a href="/admin/orders" className="text-[#DDBB92] hover:text-[#B8A082] text-sm font-medium">
                View All
              </a>
            </div>
            
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map(order => (
                  <div key={order.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium">#{order.id.slice(-8).toUpperCase()}</p>
                      <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">LKR {order.total?.toFixed(2)}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No orders found
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            
            <div className="space-y-4">
              <a
                href="/admin/add-product"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 rounded-full bg-green-100 text-green-600 mr-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Add New Product</h3>
                  <p className="text-sm text-gray-600">Add a new product to your store</p>
                </div>
              </a>

              <a
                href="/admin/orders"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Manage Orders</h3>
                  <p className="text-sm text-gray-600">View and manage all orders</p>
                </div>
              </a>

              <a
                href="/products"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 rounded-full bg-purple-100 text-purple-600 mr-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">View Products</h3>
                  <p className="text-sm text-gray-600">Browse all products in your store</p>
                </div>
              </a>
            </div>
          </div>
        </div>
    </div>
  );
};

export default AdminHome;
