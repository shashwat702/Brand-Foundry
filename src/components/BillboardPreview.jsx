import { useRef, useState } from "react";

const themes = {
  technology: {
    background: "linear-gradient(135deg,#0f172a,#312e81,#06b6d4)",
    accent: "#67e8f9",
    icon: "⚡",
  },
  healthcare: {
    background: "linear-gradient(135deg,#115e59,#0f766e,#14b8a6)",
    accent: "#ccfbf1",
    icon: "✚",
  },
  finance: {
    background: "linear-gradient(135deg,#052e16,#166534,#22c55e)",
    accent: "#bbf7d0",
    icon: "◆",
  },
  education: {
    background: "linear-gradient(135deg,#1e1b4b,#4338ca,#818cf8)",
    accent: "#e0e7ff",
    icon: "✦",
  },
};

function BillboardPreview({
  startupName,
  headline,
  tagline,
  cta,
  logo = "",
}) {
  const previewRef = useRef(null);
  const [theme, setTheme] = useState("technology");
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  const current = themes[theme];

  const downloadBillboard = async () => {
    if (!previewRef.current) return;

    setIsDownloading(true);
    setDownloadError("");

    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `${startupName || "startup"}-billboard.png`;
      link.click();
    } catch (error) {
      console.error(error);
      setDownloadError("The billboard could not be downloaded. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="billboard-builder">
      <div className="billboard-controls">
        <label>
          <span>Billboard theme</span>
          <select value={theme} onChange={(event) => setTheme(event.target.value)}>
            <option value="technology">Technology</option>
            <option value="healthcare">Healthcare</option>
            <option value="finance">Finance</option>
            <option value="education">Education</option>
          </select>
        </label>
        <button
          className="button button-secondary"
          onClick={downloadBillboard}
          disabled={isDownloading}
        >
          {isDownloading ? "Preparing image…" : "Download billboard"}
        </button>
      </div>

      <div
        className="billboard-canvas"
        id="billboard-preview"
        ref={previewRef}
        style={{ background: current.background }}
      >
        <span className="billboard-decoration">{current.icon}</span>

        <div className="billboard-brand">
          <div className="billboard-logo">
            {logo ? (
              <img src={logo} alt={`${startupName} logo`} crossOrigin="anonymous" />
            ) : (
              <span>{startupName?.charAt(0)?.toUpperCase() || "B"}</span>
            )}
          </div>
          <strong>{startupName}</strong>
        </div>

        <div className="billboard-copy">
          <h3 style={{ color: current.accent }}>{headline}</h3>
          <p>{tagline}</p>
          <span className="billboard-cta">{cta}</span>
        </div>
      </div>

      {downloadError && <p className="form-message error-message">{downloadError}</p>}
    </div>
  );
}

export default BillboardPreview;
