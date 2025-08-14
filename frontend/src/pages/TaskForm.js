import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  Save,
  X,
  Upload,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  User,
  Tag,
  FileText,
  Plus,
  Trash2,
} from "lucide-react";
import { createTask, updateTask, fetchTaskById } from "../store/slices/taskSlice";

const TaskForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { loading, error } = useSelector((state) => state.tasks);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "pending",
    dueDate: "",
    assignedTo: "",
    category: "",
    tags: [],
    attachments: [],
  });

  const [newTag, setNewTag] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
  }, [isAuthenticated, navigate]);

  // Show loading if user data is not available yet
  if (!isAuthenticated || !user) {
    return (
      <div className="dashboard-container">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-400">
              {!isAuthenticated ? "Redirecting to login..." : "Loading user data..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Additional safety check for user data
  if (!user.id && !user.email) {
    return (
      <div className="dashboard-container">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <p className="text-gray-400 mb-4">User data is incomplete</p>
            <button
              onClick={() => navigate("/login")}
              className="btn-primary">
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Priority options
  const priorityOptions = [
    { value: "low", label: "Low", color: "text-blue-400", bgColor: "bg-blue-500/10" },
    { value: "medium", label: "Medium", color: "text-yellow-400", bgColor: "bg-yellow-500/10" },
    { value: "high", label: "High", color: "text-red-400", bgColor: "bg-red-500/10" },
    { value: "urgent", label: "Urgent", color: "text-purple-400", bgColor: "bg-purple-500/10" },
  ];

  // Status options
  const statusOptions = [
    { value: "pending", label: "Pending", color: "text-yellow-400", bgColor: "bg-yellow-500/10" },
    { value: "in-progress", label: "In Progress", color: "text-blue-400", bgColor: "bg-blue-500/10" },
    { value: "completed", label: "Completed", color: "text-green-400", bgColor: "bg-green-500/10" },
    { value: "cancelled", label: "Cancelled", color: "text-gray-400", bgColor: "bg-gray-500/10" },
  ];

  // Category options
  const categoryOptions = [
    "Development",
    "Design",
    "Marketing",
    "Sales",
    "Support",
    "Administration",
    "Research",
    "Other",
  ];

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      dispatch(fetchTaskById(id))
        .unwrap()
        .then((task) => {
          setFormData({
            title: task.title || "",
            description: task.description || "",
            priority: task.priority || "medium",
            status: task.status || "pending",
            dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "",
            assignedTo: task.assignedTo || "",
            category: task.category || "",
            tags: task.tags || [],
            attachments: task.attachments || [],
          });
        })
        .catch((error) => {
          toast.error("Failed to load task details");
          navigate("/tasks");
        });
    }
  }, [id, dispatch, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagAdd = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    }));
    
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...newAttachments]
    }));
  };

  const handleFileRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Task title is required");
      return;
    }

    if (!user) {
      toast.error("User information not available. Please log in again.");
      navigate("/login");
      return;
    }

    try {
      const taskData = {
        ...formData,
        createdBy: user.id || user.email || "unknown",
      };

      if (isEditing) {
        await dispatch(updateTask({ id, taskData })).unwrap();
        toast.success("Task updated successfully!");
      } else {
        await dispatch(createTask(taskData)).unwrap();
        toast.success("Task created successfully!");
      }
      
      navigate("/tasks");
    } catch (error) {
      toast.error(error.message || "Failed to save task");
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="dashboard-container">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-32 h-32 bg-green-500/10 rounded-full blur-3xl floating"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl floating-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl floating-slow"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="dashboard-header fade-in">
          <div className="header-content">
            <div className="header-icon">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div className="header-text">
              <h1>{isEditing ? "Edit Task" : "Create Task"}</h1>
              <p>
                {isEditing 
                  ? "Update task details and information" 
                  : "Create a new task with details and attachments"
                }
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate("/tasks")}
              className="btn-secondary flex items-center space-x-2">
              <X className="w-5 h-5" />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-large flex items-center space-x-2">
              <Save className="w-5 h-5" />
              <span>{loading ? "Saving..." : (isEditing ? "Update Task" : "Create Task")}</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="card-main glass fade-in-up">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                <FileText className="w-5 h-5 text-green-400" />
                <span>Basic Information</span>
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Title */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="input-field w-full"
                    placeholder="Enter task title"
                    required
                  />
                </div>

                {/* Description */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="input-field w-full resize-none"
                    placeholder="Describe the task in detail..."
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="input-field w-full">
                    <option value="">Select category</option>
                    {categoryOptions.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Assigned To */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Assigned To
                  </label>
                  <input
                    type="text"
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleInputChange}
                    className="input-field w-full"
                    placeholder="Enter assignee name or email"
                  />
                </div>
              </div>
            </div>

            {/* Task Details */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <span>Task Details</span>
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="input-field w-full">
                    {priorityOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="input-field w-full">
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    className="input-field w-full"
                  />
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                <Tag className="w-5 h-5 text-purple-400" />
                <span>Tags</span>
              </h2>
              
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleTagAdd())}
                    className="input-field flex-1"
                    placeholder="Add a tag..."
                  />
                  <button
                    type="button"
                    onClick={handleTagAdd}
                    className="btn-primary flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>
                
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                        <span className="text-sm">{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleTagRemove(tag)}
                          className="hover:text-red-400 transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Attachments */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                <Upload className="w-5 h-5 text-orange-400" />
                <span>Attachments</span>
              </h2>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400 mb-2">Drop files here or click to upload</p>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="btn-secondary cursor-pointer">
                    Choose Files
                  </label>
                </div>
                
                {formData.attachments.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-300">Uploaded Files:</h3>
                    {formData.attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-white">{file.name}</p>
                            <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleFileRemove(index)}
                          className="text-red-400 hover:text-red-300 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
