const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Client-side redirect URI for Google sign-in (set in root .env as VITE_GOOGLE_REDIRECT_URI)
export const GOOGLE_REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI || "http://localhost:5173/auth/google/callback";

export default API_URL;