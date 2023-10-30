import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import App from "./App";

const container = document.getElementById("app-root");

if (container !== null) {
  createRoot(container).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
