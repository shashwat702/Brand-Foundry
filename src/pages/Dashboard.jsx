import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API_URL from "../services/api";

function Dashboard() {
  const [startups, setStartups] = useState([]);
  const { user } = useAuth();
  const [loadedUserId, setLoadedUserId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const isLoading = Boolean(user?._id && loadedUserId !== user._id && !error);

  useEffect(() => {
    if (!user?._id) {
      return;
    }

    const fetchStartups = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/startups`, {
          params: { userId: user._id },
        });
        setStartups(response.data.startups);
      } catch (requestError) {
        console.error(requestError);
        setError("We couldn’t load your startups. Make sure the server is running and try again.");
      } finally {
        setLoadedUserId(user._id);
      }
    };

    fetchStartups();
  }, [user?._id]);

  return (
    <main className="app-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">Workspace</span>
          <h1>Your startups</h1>
          <p>Manage your brand profiles and create new campaign directions.</p>
        </div>
        <button className="button button-primary" onClick={() => navigate("/create-startup")}>
          Add a startup
        </button>
      </div>

      <div className="summary-strip">
        <div><strong>{startups.length}</strong><span>Brand profiles</span></div>
        <div><strong>{startups.length ? "Ready" : "—"}</strong><span>Workspace status</span></div>
        <div><strong>Slogans</strong><span>Active generator</span></div>
      </div>

      {isLoading && <div className="state-card">Loading your workspace…</div>}
      {!isLoading && !user && (
        <div className="empty-state">
          <span className="empty-mark">B</span>
          <h2>Sign in to open your workspace.</h2>
          <p>Your startup profiles are kept with your account.</p>
          <button className="button button-primary" onClick={() => navigate("/login")}>
            Sign in
          </button>
        </div>
      )}
      {error && <div className="state-card state-error">{error}</div>}

      {!isLoading && user && !error && startups.length === 0 && (
        <div className="empty-state">
          <span className="empty-mark">B</span>
          <h2>Your first brand starts here.</h2>
          <p>Create a startup profile, then use it to generate focused content and campaign ideas.</p>
          <button className="button button-primary" onClick={() => navigate("/create-startup")}>
            Create your first startup
          </button>
        </div>
      )}

      {!isLoading && user && !error && startups.length > 0 && (
        <div className="startup-grid">
          {startups.map((startup, index) => (
            <article className="startup-card" key={startup._id}>
              <div className="startup-card-top">
                <span className="startup-avatar">{startup.startupName?.charAt(0) || "S"}</span>
                <span className="muted-label">Profile {String(index + 1).padStart(2, "0")}</span>
              </div>
              <div>
                <h2>{startup.startupName}</h2>
                <span className="industry-tag">{startup.industry}</span>
                <p>{startup.description}</p>
              </div>
              <button className="text-button" onClick={() => navigate(`/generate/${startup._id}`)}>
                Generate content <span aria-hidden="true">→</span>
              </button>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default Dashboard;
