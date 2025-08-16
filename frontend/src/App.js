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

  // Debug: Log current authentication state
  useEffect(() => {
    console.log("Current auth state:", {
      isAuthenticated,
      hasToken: !!token,
      tokenValue: token,
      loading,
    });
  }, [isAuthenticated, token, loading]);

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
      // Only log once to reduce console spam
      if (!localStorage.getItem("logged_out")) {
        console.log("No valid token found, user needs to login");
        localStorage.setItem("logged_out", "true");
      }
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
              {/* Public routes - always accessible */}
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

              {/* Protected routes - require authentication */}
              <Route
                path="/dashboard"
                element={
                  !isAuthenticated ? (
                    <Navigate to="/login" replace />
                  ) : (
                    <ProtectedRoute>
                      <Layout>
                        <Dashboard />
                      </Layout>
                    </ProtectedRoute>
                  )
                }
              />
              <Route
                path="/tasks"
                element={
                  !isAuthenticated ? (
                    <Navigate to="/login" replace />
                  ) : (
                    <ProtectedRoute>
                      <Layout>
                        <TaskList />
                      </Layout>
                    </ProtectedRoute>
                  )
                }
              />
              <Route
                path="/tasks/new"
                element={
                  !isAuthenticated ? (
                    <Navigate to="/login" replace />
                  ) : (
                    <ProtectedRoute>
                      <Layout>
                        <TaskForm />
                      </Layout>
                    </ProtectedRoute>
                  )
                }
              />
              <Route
                path="/tasks/:id"
                element={
                  !isAuthenticated ? (
                    <Navigate to="/login" replace />
                  ) : (
                    <ProtectedRoute>
                      <Layout>
                        <TaskDetail />
                      </Layout>
                    </ProtectedRoute>
                  )
                }
              />
              <Route
                path="/tasks/:id/edit"
                element={
                  !isAuthenticated ? (
                    <Navigate to="/login" replace />
                  ) : (
                    <ProtectedRoute>
                      <Layout>
                        <TaskForm />
                      </Layout>
                    </ProtectedRoute>
                  )
                }
              />

              {/* Admin routes */}
              <Route
                path="/users"
                element={
                  !isAuthenticated ? (
                    <Navigate to="/login" replace />
                  ) : (
                    <AdminRoute>
                      <Layout>
                        <UserManagement />
                      </Layout>
                    </AdminRoute>
                  )
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
              <Route path="*" element={<Navigate to="/login" replace />} />
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
