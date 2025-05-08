import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { RouterProvider } from "react-router-dom";
import { PathProvider } from "./context/PathProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PathProvider>
      <RouterProvider router={App} />
    </PathProvider>
  </StrictMode>
);
