import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import App from "./App";
import authReducer from "./store/slices/authSlice";
import taskReducer from "./store/slices/taskSlice";
import userReducer from "./store/slices/userSlice";

// Create a test store
const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      tasks: taskReducer,
      users: userReducer,
    },
    preloadedState: initialState,
  });
};

// Test wrapper component
const TestWrapper = ({ children, initialState = {} }) => {
  const store = createTestStore(initialState);
  return (
    <Provider store={store}>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  );
};

describe("App Component", () => {
  test("renders without crashing", () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );
  });

  test("shows loading spinner when auth is loading", () => {
    render(
      <TestWrapper
        initialState={{
          auth: {
            loading: true,
            isAuthenticated: false,
            user: null,
            token: null,
            error: null,
          },
        }}>
        <App />
      </TestWrapper>
    );

    // Should show loading spinner
    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
  });

  test("redirects to login when not authenticated", () => {
    render(
      <TestWrapper
        initialState={{
          auth: {
            loading: false,
            isAuthenticated: false,
            user: null,
            token: null,
            error: null,
          },
        }}>
        <App />
      </TestWrapper>
    );

    // Should redirect to login page
    expect(window.location.pathname).toBe("/login");
  });
});
