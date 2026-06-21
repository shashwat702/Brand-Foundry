import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API_URL from "../services/api";

function CreateStartup() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [logo, setLogo] = useState(null);
  const [formData, setFormData] = useState({
    startupName: "",
    industry: "",
    description: "",
    targetAudience: "",
    website: "",
  });

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user?._id) {
      navigate("/login");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const startupData = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        startupData.append(key, value);
      });
      startupData.append("userId", user._id);

      if (logo) {
        startupData.append("logo", logo);
      }

      await axios.post(`${API_URL}/api/startups`, startupData);
      setMessage("Startup created successfully. Opening your dashboard…");
      setTimeout(() => navigate("/dashboard"), 700);
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message ||
        "The startup could not be created. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="app-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">New brand profile</span>
          <h1>Tell us what you’re building.</h1>
          <p>A useful brand starts with a clear brief. You can refine these details later.</p>
        </div>
        <button className="button button-ghost" onClick={() => navigate("/dashboard")}>
          Back to startups
        </button>
      </div>

      <div className="form-layout">
        <form className="form-card" onSubmit={handleSubmit}>
          <div className="form-section-heading">
            <span>01</span>
            <div>
              <h2>Company details</h2>
              <p>The basics we’ll use to understand your business.</p>
            </div>
          </div>

          <div className="field-grid">
            <label className="field">
              <span>Startup name</span>
              <input name="startupName" value={formData.startupName} placeholder="e.g. Northstar" onChange={handleChange} required />
            </label>
            <label className="field">
              <span>Industry</span>
              <input name="industry" value={formData.industry} placeholder="e.g. Financial technology" onChange={handleChange} required />
            </label>
            <label className="field field-wide">
              <span>What does your startup do?</span>
              <textarea name="description" value={formData.description} placeholder="Describe the problem you solve and what makes your approach useful." onChange={handleChange} required />
              <small>A couple of clear sentences work better than marketing language.</small>
            </label>
            <label className="field">
              <span>Target audience</span>
              <input name="targetAudience" value={formData.targetAudience} placeholder="e.g. Independent retailers" onChange={handleChange} required />
            </label>
            <label className="field">
              <span>Startup logo <em>Optional</em></span>
              <input
                className="file-input"
                type="file"
                accept=".png,.jpg,.jpeg,.webp,.svg,image/png,image/jpeg,image/webp,image/svg+xml"
                onChange={(event) => setLogo(event.target.files?.[0] || null)}
              />
              <small>PNG, JPG, WebP, or SVG. Maximum size: 5 MB.</small>
            </label>
            <label className="field">
              <span>Website <em>Optional</em></span>
              <input type="url" name="website" value={formData.website} placeholder="https://example.com" onChange={handleChange} />
            </label>
          </div>

          {message && <p className="form-message" role="status">{message}</p>}

          <div className="form-actions">
            <button className="button button-primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating profile…" : "Create startup"}
            </button>
            <span>You’ll be able to generate content from your dashboard.</span>
          </div>
        </form>

        <aside className="aside-card">
          <span className="aside-kicker">A stronger brief</span>
          <h2>Write like you’re explaining it to a smart friend.</h2>
          <ul className="check-list">
            <li>Say who the product is for.</li>
            <li>Name the real problem it solves.</li>
            <li>Use specifics instead of buzzwords.</li>
          </ul>
        </aside>
      </div>
    </main>
  );
}

export default CreateStartup;
