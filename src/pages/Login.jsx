import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API_URL from "../services/api";

function Login() {
  const navigate = useNavigate();
  const { user, login, logout, googleRedirectUri } = useAuth();

  const handleSuccess = async (credentialResponse) => {
    try {
      const googleUser = jwtDecode(credentialResponse.credential);
      const response = await axios.post(`${API_URL}/api/auth/google`, googleUser);
      login(response.data.user);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleError = (err) => {
    console.error("Google login error:", err);
    const origin = window.location.origin;

    alert(
      "Google sign-in failed. Common cause: 'origin_mismatch'.\n" +
        `Current origin: ${origin}\n` +
        `Expected redirect URI (from config): ${googleRedirectUri || "(not set)"}\n\n` +
        "Fix: In Google Cloud Console, add the current origin to 'Authorized JavaScript origins' and add the redirect URI to 'Authorized redirect URIs'. Also set the same VITE_GOOGLE_CLIENT_ID and VITE_GOOGLE_REDIRECT_URI in your Vercel environment variables."
    );
  };

  return (
    <main className="auth-page">
      <section className="auth-story">
        <span className="eyebrow eyebrow-light">Your brand workspace</span>
        <h1>Good ideas deserve clear language.</h1>
        <p>Keep your startup briefs and generated brand directions together in one focused workspace.</p>
        <div className="auth-quote">
          <span>Brand principle 01</span>
          <p>Clarity is more memorable than cleverness.</p>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          {user ? (
            <>
              {user.picture ? (
                <img className="profile-image" src={user.picture} alt={user.name} />
              ) : (
                <span className="profile-fallback">{user.name?.charAt(0) || "U"}</span>
              )}
              <span className="eyebrow">Signed in</span>
              <h2>Welcome back, {user.name?.split(" ")[0]}.</h2>
              <p className="auth-email">{user.email}</p>
              <button className="button button-primary button-full" onClick={() => navigate("/dashboard")}>
                Open dashboard
              </button>
              <button className="button button-ghost button-full" onClick={handleLogout}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <span className="eyebrow">Welcome back</span>
              <h2>Sign in to your workspace.</h2>
              <p>Continue building brand directions for your startups.</p>
              <div className="google-login-wrap">
                <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
              </div>
              <p className="auth-fine-print">By continuing, you agree to keep things thoughtful and useful.</p>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

export default Login;
