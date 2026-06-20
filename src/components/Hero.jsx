import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-copy">
          <span className="eyebrow">Brand building, made practical</span>
          <h1>Give your startup a voice people remember.</h1>
          <p>
            Shape clear slogans, campaign ideas, and marketing content from one
            thoughtful brand brief.
          </p>
          <div className="hero-actions">
            <button className="button button-primary" onClick={() => navigate("/create-startup")}>
              Build your brand
            </button>
            <button className="button button-secondary" onClick={() => navigate("/dashboard")}>
              View your startups
            </button>
          </div>
          <p className="hero-note">No complicated setup. Start with what you already know.</p>
        </div>

        <div className="hero-preview" aria-label="Example generated brand direction">
          <div className="preview-toolbar">
            <span>Brand direction</span>
            <span className="status-dot">Ready</span>
          </div>
          <div className="preview-body">
            <span className="preview-label">Slogan</span>
            <p className="preview-quote">“Make the next move matter.”</p>
            <div className="preview-meta">
              <div>
                <span>Voice</span>
                <strong>Clear &amp; assured</strong>
              </div>
              <div>
                <span>Audience</span>
                <strong>Modern teams</strong>
              </div>
            </div>
            <div className="preview-tags">
              <span>Direct</span>
              <span>Optimistic</span>
              <span>Human</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
