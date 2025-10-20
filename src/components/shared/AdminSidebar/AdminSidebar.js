import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { LayoutDashboard, Package, Users, Plus, LayoutList, Star, CircleUser } from "lucide-react";

const AdminSidebar = () => {
  const location = useLocation();
  const { currentUser } = useAuth();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    {
      title: "Main menu",
      items: [
        { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
        { name: "Order Management", path: "/admin/orders", icon: Package },
        { name: "Customers", path: "/admin/customers", icon: Users }
      ]
    },
    {
      title: "Product",
      items: [
        { name: "Add Products", path: "/admin/add-product", icon: Plus },
        { name: "Product List", path: "/admin/products", icon: LayoutList },
        { name: "Reviews", path: "/admin/reviews", icon: Star }
      ]
    },
    {
      title: "Admin",
      items: [
        { name: "Profile", path: "/admin/profile", icon: CircleUser }
      ]
    }
  ];

  return (
    <div className="w-64 bg-[#0D0806] text-white h-screen fixed left-0 top-0 overflow-y-auto">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <img 
            src="/Logo.png" 
            alt="Glowy Logo" 
            className="h-8 w-8 object-contain"
          />
          <span className="text-xl font-bold text-[#DDBB92]">Glowy</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 space-y-6">
        {menuItems.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              {section.title}
            </h3>
            <ul className="space-y-2">
              {section.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                      isActive(item.path)
                        ? 'bg-[#DDBB92] text-[#2B2A29] font-medium'
                        : 'text-gray-300 hover:bg-[#E3D2BD] hover:text-[#2B2A29]'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* User Profile Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-[#DDBB92] rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-[#2B2A29]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Admin'}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {currentUser?.email || 'admin@glowy.com'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
