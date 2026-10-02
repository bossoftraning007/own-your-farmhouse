import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ErrorBoundary } from "./components/ErrorBoundary.tsx";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Missing #root element - check index.html");
}

// The boundary wraps App itself, not App's children. Mounted inside App it
// could never catch a render error thrown by App's own component tree.
createRoot(root).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);