import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            borderRadius: "12px",
            background: "#1B2A4E",
            color: "#fff",
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: "14px",
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
