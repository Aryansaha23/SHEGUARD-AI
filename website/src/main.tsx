import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import "./index.css";

import App from "./App";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>

        {/* Main Website */}
        <Route
          path="/"
          element={<App />}
        />

        {/* Privacy Policy */}
        <Route
          path="/privacy"
          element={<PrivacyPolicy />}
        />

        {/* Terms & Conditions */}
        <Route
          path="/terms"
          element={<Terms />}
        />

      </Routes>
    </BrowserRouter>
  </StrictMode>
);