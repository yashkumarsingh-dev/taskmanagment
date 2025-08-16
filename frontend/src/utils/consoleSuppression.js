// Suppress development warnings and errors
// Suppress React Router warnings
const originalWarn = console.warn;
console.warn = (...args) => {
  const message = args[0];
  if (
    typeof message === "string" &&
    (message.includes("React Router Future Flag Warning") ||
      message.includes("WebSocket connection") ||
      message.includes("favicon.ico"))
  ) {
    return;
  }
  originalWarn.apply(console, args);
};

// Suppress WebSocket errors
const originalError = console.error;
console.error = (...args) => {
  const message = args[0];
  if (
    typeof message === "string" &&
    (message.includes("WebSocket connection") ||
      message.includes("favicon.ico"))
  ) {
    return;
  }
  originalError.apply(console, args);
};

export default {};
