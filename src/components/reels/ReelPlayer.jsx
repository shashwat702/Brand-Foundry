import { useState } from "react";
import axios from "axios";
import { Player } from "@remotion/player";
import {
  REEL_DURATION_IN_FRAMES,
  REEL_FPS,
  REEL_HEIGHT,
  REEL_WIDTH,
  ReelAd,
} from "../../remotion/ReelAd";
import API_URL from "../../services/api";

const EXPECTED_RENDER_VERSION = "reel-render-v5-edge-with-audio";

function ReelPlayer({
  startupName,
  logo,
  industry = "",
  targetAudience = "",
  description = "",
  campaign = null,
}) {
  const [isRendering, setIsRendering] = useState(false);
  const [renderError, setRenderError] = useState("");

  const inputProps = {
    startupName,
    logo,
    industry,
    targetAudience,
    description,
    campaign,
  };

  const downloadVideo = async () => {
    setIsRendering(true);
    setRenderError("");

    try {
      const versionResponse = await axios.get(`${API_URL}/api/video/version`, {
        timeout: 10 * 1000,
      });

      if (versionResponse.data?.version !== EXPECTED_RENDER_VERSION) {
        throw new Error(
          "Your backend render server is still running an older version. Restart the backend and try again."
        );
      }

      const response = await axios.post(
        `${API_URL}/api/video/render`,
        inputProps,
        {
          responseType: "blob",
          timeout: 10 * 60 * 1000,
        }
      );
      const renderVersion = response.headers["x-render-version"];

      if (renderVersion !== EXPECTED_RENDER_VERSION) {
        throw new Error(
          "The MP4 came from an older render server. Restart the backend and render again."
        );
      }

      const videoUrl = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = videoUrl;
      link.download = `${startupName || "brand"}-reel-${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(videoUrl);
    } catch (error) {
      console.error(error);

      if (error.response?.data instanceof Blob) {
        const errorText = await error.response.data.text();

        try {
          const parsed = JSON.parse(errorText);
          setRenderError(parsed.message || "The video could not be rendered.");
        } catch {
          setRenderError("The video could not be rendered.");
        }
      } else {
        setRenderError(
          error.message ||
          error.response?.data?.message ||
          "The video could not be rendered. Make sure the backend is running."
        );
      }
    } finally {
      setIsRendering(false);
    }
  };

  return (
    <section className="reel-builder" aria-label="Generated reel video">
      <div className="reel-builder-heading">
        <div>
          <span className="eyebrow">Social video</span>
          <h3>15-second brand reel</h3>
        </div>
        <span className="reel-frame-count">9:16 · MP4</span>
      </div>

      <div className="reel-video-shell">
        <Player
          component={ReelAd}
          inputProps={inputProps}
          durationInFrames={REEL_DURATION_IN_FRAMES}
          compositionWidth={REEL_WIDTH}
          compositionHeight={REEL_HEIGHT}
          fps={REEL_FPS}
          controls
          loop
          style={{
            width: "100%",
            aspectRatio: "9 / 16",
          }}
        />
      </div>

      <div className="reel-export">
        <div>
          <strong>Ready for social</strong>
          <span>Rendered at 720 × 1280 in H.264 MP4 format.</span>
        </div>
        <button
          className="button button-primary"
          disabled={isRendering}
          onClick={downloadVideo}
        >
          {isRendering ? "Rendering MP4… this may take a minute" : "Render & download MP4"}
        </button>
      </div>

      {renderError && (
        <p className="form-message error-message" role="alert">
          {renderError}
        </p>
      )}
    </section>
  );
}

export default ReelPlayer;
