import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  CheckSquare,
  Clock,
  TrendingUp,
  AlertTriangle,
  Calendar,
  CheckCircle,
  Plus,
  ArrowRight,
} from "lucide-react";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  // Mock data for demonstration
  const stats = [
    {
      title: "Total Tasks",
      value: "0",
      icon: CheckSquare,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      title: "Pending",
      value: "0",
      icon: Clock,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
    },
    {
      title: "In Progress",
      value: "0",
      icon: TrendingUp,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
    },
    {
      title: "High Priority",
      value: "0",
      icon: AlertTriangle,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
    },
    {
      title: "Overdue",
      value: "0",
      icon: Calendar,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
    },
    {
      title: "Completed",
      value: "0",
      icon: CheckCircle,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-32 h-32 bg-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="mb-8 fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Dashboard
              </h1>
              <p className="text-gray-400">
                Welcome back, {user?.email || "User"}!
              </p>
            </div>
            <Link
              to="/tasks/new"
              className="btn-primary mt-4 sm:mt-0 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>New Task</span>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className={`card glass-hover fade-in-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-white mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bgColor} ${stat.borderColor} border`}
                  >
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Tasks Section */}
        <div className="card glass fade-in-up" style={{ animationDelay: "0.6s" }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Recent Tasks</h2>
            <Link
              to="/tasks"
              className="text-green-400 hover:text-green-300 font-medium transition-colors duration-200 flex items-center space-x-1"
            >
              <span>View all tasks</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Empty State */}
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800/50 flex items-center justify-center">
              <CheckSquare className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-300 mb-2">
              No tasks found
            </h3>
            <p className="text-gray-400 mb-6">
              Get started by creating your first task
            </p>
            <Link
              to="/tasks/new"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Create Task</span>
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="card glass-hover fade-in-up" style={{ animationDelay: "0.7s" }}>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to="/tasks/new"
                className="flex items-center p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors duration-200"
              >
                <Plus className="w-5 h-5 text-green-400 mr-3" />
                <span className="text-gray-300">Create New Task</span>
              </Link>
              <Link
                to="/tasks"
                className="flex items-center p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors duration-200"
              >
                <CheckSquare className="w-5 h-5 text-blue-400 mr-3" />
                <span className="text-gray-300">View All Tasks</span>
              </Link>
              {user?.role === "admin" && (
                <Link
                  to="/users"
                  className="flex items-center p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors duration-200"
                >
                  <div className="w-5 h-5 text-purple-400 mr-3 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <span className="text-xs">👥</span>
                  </div>
                  <span className="text-gray-300">Manage Users</span>
                </Link>
              )}
            </div>
          </div>

          <div className="card glass-hover fade-in-up" style={{ animationDelay: "0.8s" }}>
            <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Database</span>
                <span className="flex items-center text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">API Status</span>
                <span className="flex items-center text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Last Sync</span>
                <span className="text-gray-300">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
