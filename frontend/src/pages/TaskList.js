import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchTasks } from "../store/slices/taskSlice";
import {
  Plus,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Download,
} from "lucide-react";

const TaskList = () => {
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const filteredTasks = tasks
    .filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || task.status === statusFilter;
      const matchesPriority =
        priorityFilter === "all" || task.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === "due_date" || sortBy === "created_at") {
        aValue = new Date(aValue || 0);
        bValue = new Date(bValue || 0);
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "in_progress":
        return <Clock className="w-5 h-5 text-blue-400" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return "badge-completed";
      case "in_progress":
        return "badge-progress";
      default:
        return "badge-pending";
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high":
        return "badge-high";
      case "medium":
        return "badge-progress";
      default:
        return "badge-completed";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No due date";
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = (dueDate, status) => {
    if (!dueDate || status === "completed") return false;
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-800 rounded-lg w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card">
                  <div className="h-4 bg-gray-800 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-800 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-800 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Tasks</h1>
              <p className="text-gray-400">
                Manage and track your tasks efficiently
              </p>
            </div>
            <Link
              to="/tasks/new"
              className="btn-primary mt-4 sm:mt-0 flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>New Task</span>
            </Link>
          </div>
        </div>

        {/* Filters and Search */}
        <div
          className="card glass mb-6 fade-in-up"
          style={{ animationDelay: "0.1s" }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="input-field">
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            {/* Sort */}
            <div className="flex space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field flex-1">
                <option value="created_at">Created Date</option>
                <option value="due_date">Due Date</option>
                <option value="title">Title</option>
                <option value="priority">Priority</option>
              </select>
              <button
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="btn-secondary px-3">
                {sortOrder === "asc" ? (
                  <SortAsc className="w-5 h-5" />
                ) : (
                  <SortDesc className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Tasks Grid */}
        {filteredTasks.length === 0 ? (
          <div
            className="card glass text-center py-12 fade-in-up"
            style={{ animationDelay: "0.2s" }}>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800/50 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-300 mb-2">
              No tasks found
            </h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
                ? "Try adjusting your filters"
                : "Get started by creating your first task"}
            </p>
            <Link
              to="/tasks/new"
              className="btn-primary inline-flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Create Task</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task, index) => (
              <div
                key={task.id}
                className={`card glass-hover fade-in-up`}
                style={{ animationDelay: `${0.2 + index * 0.05}s` }}>
                {/* Task Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(task.status)}
                    <div>
                      <span className={`badge ${getStatusBadge(task.status)}`}>
                        {task.status.replace("_", " ")}
                      </span>
                      <span
                        className={`badge ${getPriorityBadge(
                          task.priority
                        )} ml-2`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/tasks/${task.id}`}
                      className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors">
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/tasks/${task.id}/edit`}
                      className="p-2 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors">
                      <Edit className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Task Content */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                    {task.title}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-3">
                    {task.description}
                  </p>
                </div>

                {/* Task Meta */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-400">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span
                      className={
                        isOverdue(task.due_date, task.status)
                          ? "text-red-400"
                          : ""
                      }>
                      {formatDate(task.due_date)}
                      {isOverdue(task.due_date, task.status) && " (Overdue)"}
                    </span>
                  </div>
                  {task.assigned_to && (
                    <div className="text-sm text-gray-400">
                      Assigned to: {task.assigned_to}
                    </div>
                  )}
                </div>

                {/* Attachments */}
                {task.attachments && task.attachments.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm text-gray-400 mb-2">
                      Attachments:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {task.attachments.map((attachment, idx) => (
                        <button
                          key={idx}
                          className="flex items-center space-x-1 px-2 py-1 rounded text-xs bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 transition-colors">
                          <Download className="w-3 h-3" />
                          <span>{attachment.filename}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Created Date */}
                <div className="text-xs text-gray-500">
                  Created: {formatDate(task.created_at)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
