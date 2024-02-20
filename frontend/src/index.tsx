import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import App from "./App";
import i18n from "../i18n";
import { I18nextProvider } from "react-i18next";

const container = document.getElementById("app-root");

if (container !== null) {
  createRoot(container).render(
    <React.StrictMode>
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    </React.StrictMode>
  );
}
