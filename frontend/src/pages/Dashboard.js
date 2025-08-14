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
  Activity,
  Users,
  Zap,
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
      gradient: "from-blue-500/20 to-blue-600/20",
    },
    {
      title: "Pending",
      value: "0",
      icon: Clock,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
      gradient: "from-yellow-500/20 to-orange-500/20",
    },
    {
      title: "In Progress",
      value: "0",
      icon: TrendingUp,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
      gradient: "from-green-500/20 to-emerald-500/20",
    },
    {
      title: "High Priority",
      value: "0",
      icon: AlertTriangle,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
      gradient: "from-red-500/20 to-pink-500/20",
    },
    {
      title: "Overdue",
      value: "0",
      icon: Calendar,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
      gradient: "from-orange-500/20 to-red-500/20",
    },
    {
      title: "Completed",
      value: "0",
      icon: CheckCircle,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      gradient: "from-emerald-500/20 to-green-500/20",
    },
  ];

  const quickActions = [
    {
      title: "Create New Task",
      description: "Add a new task to your workflow",
      icon: Plus,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      href: "/tasks/new",
    },
    {
      title: "View All Tasks",
      description: "See all your tasks in one place",
      icon: CheckSquare,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      href: "/tasks",
    },
    {
      title: "Manage Users",
      description: "Admin panel for user management",
      icon: Users,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      href: "/users",
      adminOnly: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-32 h-32 bg-green-500/10 rounded-full blur-3xl floating"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl floating-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl floating-slow"></div>
        <div className="absolute top-1/4 right-1/4 w-24 h-24 bg-yellow-500/5 rounded-full blur-2xl floating"></div>
        <div className="absolute bottom-1/4 left-1/4 w-20 h-20 bg-red-500/5 rounded-full blur-2xl floating-delayed"></div>
      </div>

      <div className="relative z-10 p-8 max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="mb-12 fade-in">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-2xl">
                  <Activity className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold text-white mb-2">
                    Dashboard
                  </h1>
                  <p className="text-xl text-gray-400">
                    Welcome back,{" "}
                    <span className="text-gradient font-semibold">
                      {user?.email?.split("@")[0] || "User"}
                    </span>
                    !
                  </p>
                </div>
              </div>
            </div>
            <Link
              to="/tasks/new"
              className="btn-primary flex items-center space-x-3 group px-8 py-4 text-lg">
              <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
              <span>New Task</span>
            </Link>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className={`card glass-hover fade-in-up group`}
                style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex flex-col items-center text-center space-y-4">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center ${stat.bgColor} ${stat.borderColor} border-2 group-hover:scale-110 transition-transform duration-300`}
                    style={{
                      background: `linear-gradient(135deg, ${stat.gradient})`,
                    }}>
                    <Icon
                      className={`w-8 h-8 ${stat.color} group-hover:scale-110 transition-transform duration-300`}
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-4xl font-bold text-white group-hover:text-gradient transition-all duration-300">
                      {stat.value}
                    </p>
                    <p className="text-sm font-medium text-gray-400">
                      {stat.title}
                    </p>
                  </div>
                  <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-1000"
                      style={{
                        width: `${Math.min(parseInt(stat.value) * 10, 100)}%`,
                      }}></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Enhanced Recent Tasks Section - Takes 2 columns */}
          <div className="xl:col-span-2">
            <div
              className="card glass fade-in-up h-full"
              style={{ animationDelay: "0.6s" }}>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <CheckSquare className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Recent Tasks
                    </h2>
                    <p className="text-gray-400">Your latest task activities</p>
                  </div>
                </div>
                <Link
                  to="/tasks"
                  className="text-green-400 hover:text-green-300 font-medium transition-colors duration-200 flex items-center space-x-2 group">
                  <span>View all tasks</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>

              {/* Enhanced Empty State */}
              <div className="text-center py-20">
                <div className="w-32 h-32 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-gray-800/50 to-gray-700/50 flex items-center justify-center floating">
                  <CheckSquare className="w-16 h-16 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-300 mb-4">
                  No tasks found
                </h3>
                <p className="text-gray-400 mb-10 max-w-md mx-auto text-lg">
                  Get started by creating your first task and begin organizing
                  your workflow
                </p>
                <Link
                  to="/tasks/new"
                  className="btn-primary inline-flex items-center space-x-3 group px-8 py-4 text-lg">
                  <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                  <span>Create Task</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Enhanced Sidebar - Takes 1 column */}
          <div className="space-y-8">
            {/* Enhanced Quick Actions */}
            <div
              className="card glass-hover fade-in-up"
              style={{ animationDelay: "0.7s" }}>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Quick Actions</h3>
              </div>
              <div className="space-y-4">
                {quickActions.map((action, index) => {
                  if (action.adminOnly && user?.role !== "admin") return null;
                  const Icon = action.icon;
                  return (
                    <Link
                      key={action.title}
                      to={action.href}
                      className="flex items-center p-4 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-300 group border border-transparent hover:border-gray-600/50">
                      <div
                        className={`w-12 h-12 rounded-xl ${action.bgColor} flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`w-6 h-6 ${action.color}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium group-hover:text-gradient transition-all duration-300">
                          {action.title}
                        </h4>
                        <p className="text-gray-400 text-sm">
                          {action.description}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Enhanced System Status */}
            <div
              className="card glass-hover fade-in-up"
              style={{ animationDelay: "0.8s" }}>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">System Status</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-800/30 border border-gray-700/30">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full pulse"></div>
                    <span className="text-gray-300 font-medium">Database</span>
                  </div>
                  <span className="text-green-400 font-semibold">
                    Connected
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-800/30 border border-gray-700/30">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full pulse"></div>
                    <span className="text-gray-300 font-medium">
                      API Status
                    </span>
                  </div>
                  <span className="text-green-400 font-semibold">Online</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-800/30 border border-gray-700/30">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300 font-medium">Last Sync</span>
                  </div>
                  <span className="text-gray-300 font-mono">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-800/30 border border-gray-700/30">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                    <span className="text-gray-300 font-medium">Version</span>
                  </div>
                  <span className="text-gray-300 font-mono">v1.0.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
