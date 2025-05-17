import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { RouterProvider } from "react-router-dom";
import { PathProvider } from "./context/PathProvider";
import { AuthProvider } from "./context/AuthProvider";
import { ToastProvider } from "@/context/ToastProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PathProvider>
      <AuthProvider>
        <ToastProvider>
          <RouterProvider router={App} />
        </ToastProvider>
      </AuthProvider>
    </PathProvider>
  </StrictMode>
);
