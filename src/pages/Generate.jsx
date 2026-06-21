import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import BillboardPreview from "../components/BillboardPreview";
import ReelPlayer from "../components/reels/ReelPlayer";
import API_URL from "../services/api";

const generationOptions = {
  slogan: {
    endpoint: "slogan",
    button: "Generate slogans",
    loading: "Developing slogans…",
    resultTitle: "Slogan ideas",
  },
  billboard: {
    endpoint: "billboard",
    button: "Generate billboard",
    loading: "Developing billboard…",
    resultTitle: "Billboard concepts",
  },
  "reel-script": {
    endpoint: "reel-script",
    button: "Create Brand reel",
    loading: "Directing your campaign…",
    resultTitle: "Brand reel campaign",
  },
};

function CampaignBrief({ campaign }) {
  if (!campaign) return null;

  return (
    <details className="campaign-brief">
      <summary>
        <span>
          <strong>Campaign strategy</strong>
          <small>Angle, audience insight, voiceover, and publishing copy</small>
        </span>
        <span>View brief</span>
      </summary>
      <div className="campaign-brief-body">
        <div>
          <span>Campaign angle</span>
          <p>{campaign.campaignAngle}</p>
        </div>
        <div>
          <span>Audience insight</span>
          <p>{campaign.audienceInsight}</p>
        </div>
        <div className="campaign-brief-wide">
          <span>Voiceover</span>
          <p>{campaign.voiceover}</p>
        </div>
        <div className="campaign-brief-wide">
          <span>Social caption</span>
          <p>{campaign.caption}</p>
          <small>{campaign.hashtags?.join(" ")}</small>
        </div>
      </div>
    </details>
  );
}

function Generate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [startupName, setStartupName] = useState("");
  const [industry, setIndustry] = useState("");
  const [description, setDescription] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [logo, setLogo] = useState("");
  const [result, setResult] = useState("");
  const [reelCampaign, setReelCampaign] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [generationType, setGenerationType] = useState("slogan");
  const [billboardData, setBillboardData] = useState(null);

  useEffect(() => {
    if (!id) return;

    axios.get(`${API_URL}/api/startups/${id}`)
      .then((response) => {
        const startup = response.data.startup;
        setStartupName(startup.startupName);
        setIndustry(startup.industry);
        setDescription(startup.description);
        setTargetAudience(startup.targetAudience);
        setLogo(startup.logo || "");
      })
      .catch((requestError) => {
        console.error(requestError);
        setError("We couldn’t load this startup profile.");
      });
  }, [id]);

  const generate = async (type) => {
    setIsGenerating(true);
    setError("");
    setResult("");
    setReelCampaign(null);
    setBillboardData(null);
    setGenerationType(type);

    try {
      const response = await axios.post(
        `${API_URL}/api/ai/${generationOptions[type].endpoint}`,
        {
          startupName,
          industry,
          description,
          targetAudience,
        }
      );

      setResult(response.data.content);

      if (type === "reel-script") {
        setReelCampaign(response.data.reel);
      }

      if (type === "billboard") {
        const content = response.data.content;
        const getField = (label) => {
          const match = content.match(new RegExp(`${label}\\s*:\\s*(.+)`, "i"));
          return match?.[1]?.trim();
        };

        setBillboardData({
          headline: getField("Headline") || startupName,
          tagline: getField("Tagline") || "A clearer way forward.",
          cta: getField("Call to action") || getField("CTA") || "Learn more",
        });
      }
    } catch (requestError) {
      console.error(requestError);
      setError(
        requestError.response?.data?.message ||
        "Generation failed. Check that the API is available and try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const isReelResult =
    generationType === "reel-script" && Boolean(reelCampaign);

  return (
    <main className={`app-page generate-page ${isReelResult ? "has-reel" : ""}`}>
      <div className="page-heading">
        <div>
          <span className="eyebrow">Content studio</span>
          <h1>Develop your next brand idea.</h1>
          <p>Start with a clear brief, then turn it into campaign-ready creative.</p>
        </div>
        <button className="button button-ghost" onClick={() => navigate("/dashboard")}>
          Back to startups
        </button>
      </div>

      <div className="studio-layout">
        <section className="form-card studio-form">
          <div className="form-section-heading">
            <span>Brief</span>
            <div>
              <h2>Brand context</h2>
              <p>Specific inputs produce more distinctive creative.</p>
            </div>
          </div>

          <div className="field-grid">
            <label className="field">
              <span>Startup name</span>
              <input value={startupName} onChange={(event) => setStartupName(event.target.value)} />
            </label>
            <label className="field">
              <span>Industry</span>
              <input value={industry} onChange={(event) => setIndustry(event.target.value)} />
            </label>
            <label className="field field-wide">
              <span>Description</span>
              <textarea value={description} onChange={(event) => setDescription(event.target.value)} />
            </label>
            <label className="field field-wide">
              <span>Target audience</span>
              <input value={targetAudience} onChange={(event) => setTargetAudience(event.target.value)} />
            </label>
          </div>

          <div className="generation-actions">
            {Object.entries(generationOptions).map(([type, option]) => (
              <button
                className={type === generationType ? "button button-primary" : "button button-secondary"}
                disabled={isGenerating}
                key={type}
                onClick={() => generate(type)}
              >
                {isGenerating && type === generationType ? option.loading : option.button}
              </button>
            ))}
          </div>

          {error && <p className="form-message error-message" role="alert">{error}</p>}
        </section>

        <section className={`result-card ${result ? "has-result" : ""} ${isReelResult ? "reel-result-card" : ""}`}>
          <div className="result-heading">
            <div>
              <span className="eyebrow">Generated direction</span>
              <h2>{generationOptions[generationType].resultTitle}</h2>
            </div>
            
          </div>

          {result ? (
            <>
              {isReelResult ? (
                <>
                  <ReelPlayer
                    startupName={startupName}
                    logo={logo}
                    industry={industry}
                    targetAudience={targetAudience}
                    description={description}
                    campaign={reelCampaign}
                  />
                  <CampaignBrief campaign={reelCampaign} />
                </>
              ) : (
                <div className="result-content">{result}</div>
              )}

              {generationType === "billboard" && billboardData && (
                <BillboardPreview
                  startupName={startupName}
                  headline={billboardData.headline}
                  tagline={billboardData.tagline}
                  cta={billboardData.cta}
                  logo={logo}
                />
              )}
            </>
          ) : (
            <div className="result-placeholder">
              <span>“</span>
              <p>Your generated content will appear here.</p>
              <small>Complete the brief and choose what you want to create.</small>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Generate;
