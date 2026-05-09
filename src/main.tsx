import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import { ThemeProvider } from "./lib/theme";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              borderRadius: "14px",
              background: "#0F1115",
              color: "#fff",
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: "14px",
              padding: "12px 16px",
              boxShadow: "0 8px 24px rgba(15,17,21,.25)",
            },
            success: {
              iconTheme: { primary: "#FF6B1F", secondary: "#fff" },
            },
            error: {
              iconTheme: { primary: "#DC2626", secondary: "#fff" },
            },
          }}
        />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
