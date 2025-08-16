import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Toaster } from "react-hot-toast";
import { getCurrentUser } from "./store/slices/authSlice";
import ErrorBoundary from "./components/ErrorBoundary";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import TaskList from "./pages/TaskList";
import TaskDetail from "./pages/TaskDetail";
import TaskForm from "./pages/TaskForm";
import UserManagement from "./pages/UserManagement";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, token, loading } = useSelector(
    (state) => state.auth
  );

  // Initialize authentication on app startup
  useEffect(() => {
    if (
      token &&
      token !== "undefined" &&
      token !== "null" &&
      !isAuthenticated
    ) {
      console.log("Initializing authentication with token:", token);
      dispatch(getCurrentUser());
    } else if (!token || token === "undefined" || token === "null") {
      console.log("No valid token found, redirecting to login");
      // Clear any invalid tokens
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, [dispatch, token, isAuthenticated]);

  // Show loading while initializing authentication
  if (loading && token && token !== "undefined" && token !== "null") {
    return (
      <div className="dark">
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Initializing...</p>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to login if no valid token
  if (!token || token === "undefined" || token === "null") {
    return (
      <div className="dark">
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h1 className="text-xl font-semibold text-white mb-2">
              Authentication Required
            </h1>
            <p className="text-gray-400 mb-4">Please log in to continue</p>
            <button
              onClick={() => (window.location.href = "/login")}
              className="btn-primary">
              Go to Login
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="btn-secondary mt-2">
              Clear Data & Reload
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="dark">
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}>
          <div className="min-h-screen">
            <Routes>
              {/* Public routes */}
              <Route
                path="/login"
                element={
                  isAuthenticated ? (
                    <Navigate to="/dashboard" replace />
                  ) : (
                    <Login />
                  )
                }
              />
              <Route
                path="/register"
                element={
                  isAuthenticated ? (
                    <Navigate to="/dashboard" replace />
                  ) : (
                    <Register />
                  )
                }
              />

              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tasks"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <TaskList />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tasks/new"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <TaskForm />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tasks/:id"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <TaskDetail />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tasks/:id/edit"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <TaskForm />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* Admin routes */}
              <Route
                path="/users"
                element={
                  <AdminRoute>
                    <Layout>
                      <UserManagement />
                    </Layout>
                  </AdminRoute>
                }
              />

              {/* Default redirect */}
              <Route
                path="/"
                element={
                  isAuthenticated ? (
                    <Navigate to="/dashboard" replace />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </Router>

        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "rgba(17, 17, 17, 0.95)",
              color: "#ffffff",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(16px)",
            },
            success: {
              iconTheme: {
                primary: "#10b981",
                secondary: "#ffffff",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#ffffff",
              },
            },
          }}
        />
      </div>
    </ErrorBoundary>
  );
}

export default App;
