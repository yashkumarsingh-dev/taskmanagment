import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  LogOut,
  Menu,
  X,
  Settings,
  Bell,
  User,
} from "lucide-react";
import { logout } from "../store/slices/authSlice";

const Sidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  const menuItems = [
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: LayoutDashboard,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      path: "/tasks",
      name: "Tasks",
      icon: CheckSquare,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      path: "/users",
      name: "Users",
      icon: Users,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      adminOnly: true,
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Enhanced Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-gray-900/95 to-black/95 backdrop-blur-2xl border-r border-gray-800/50 shadow-2xl z-50 transform transition-all duration-500 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:relative lg:z-auto`}
      >
        {/* Enhanced Sidebar Header */}
        <div className="p-6 border-b border-gray-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                <CheckSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Task Manager</h1>
                <p className="text-xs text-gray-400">v1.0.0</p>
              </div>
            </div>
            <button
              onClick={onToggle}
              className="lg:hidden p-2 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-300 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Enhanced User Profile Section */}
        <div className="p-6 border-b border-gray-800/50">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user?.email?.split("@")[0] || "User"}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {user?.email || "user@example.com"}
              </p>
              <div className="flex items-center mt-1">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                <span className="text-xs text-green-400 font-medium">Online</span>
              </div>
            </div>
          </div>
          
          {/* Enhanced Quick Actions */}
          <div className="flex space-x-2">
            <button className="flex-1 p-2 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-300 text-gray-400 hover:text-white group">
              <Bell className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
            </button>
            <button className="flex-1 p-2 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-300 text-gray-400 hover:text-white group">
              <Settings className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Enhanced Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item, index) => {
            if (item.adminOnly && user?.role !== "admin") return null;
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-item group ${
                  isActive ? "active" : ""
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-3 transition-all duration-300 ${
                  isActive 
                    ? "bg-white/20" 
                    : `${item.bgColor} group-hover:bg-white/10`
                }`}>
                  <Icon className={`w-5 h-5 transition-all duration-300 ${
                    isActive 
                      ? "text-white" 
                      : `${item.color} group-hover:text-white`
                  }`} />
                </div>
                <span className="font-medium transition-all duration-300">
                  {item.name}
                </span>
                {isActive && (
                  <div className="absolute right-2 w-2 h-2 bg-white rounded-full"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Enhanced Footer */}
        <div className="p-4 border-t border-gray-800/50">
          <button
            onClick={handleLogout}
            className="w-full sidebar-item group text-red-400 hover:text-red-300"
          >
            <div className="w-10 h-10 rounded-xl bg-red-500/10 group-hover:bg-red-500/20 flex items-center justify-center mr-3 transition-all duration-300">
              <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="font-medium">Logout</span>
          </button>
          
          {/* Enhanced System Info */}
          <div className="mt-4 p-3 rounded-xl bg-gray-800/30 border border-gray-700/30">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>System Status</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full pulse"></div>
                <span className="text-green-400">Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 lg:hidden p-3 rounded-xl bg-gray-900/90 backdrop-blur-sm border border-gray-800/50 text-white hover:bg-gray-800/90 transition-all duration-300 shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </button>
    </>
  );
};

export default Sidebar;
