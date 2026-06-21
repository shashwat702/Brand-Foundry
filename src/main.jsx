import ReactDOM from "react-dom/client";

import App from "./App.jsx";
import "./index.css";

import { AuthProvider } from "./context/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import API_URL, { GOOGLE_REDIRECT_URI } from "./services/api";

// Debug: log runtime Google OAuth and origin info to help diagnose origin_mismatch
console.info("Google clientId (VITE_GOOGLE_CLIENT_ID):", import.meta.env.VITE_GOOGLE_CLIENT_ID);
console.info("Google redirect URI (VITE_GOOGLE_REDIRECT_URI):", GOOGLE_REDIRECT_URI);
console.info("App origin:", window.location.origin);

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <GoogleOAuthProvider
    clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
  >
    <AuthProvider>
      <App />
    </AuthProvider>
  </GoogleOAuthProvider>
);
