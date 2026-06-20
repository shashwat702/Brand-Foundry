import { Composition } from "remotion";
import {
  REEL_DURATION_IN_FRAMES,
  REEL_FPS,
  REEL_HEIGHT,
  REEL_WIDTH,
  ReelAd,
} from "./ReelAd";

export const RemotionRoot = () => (
  <Composition
    id="BrandReel"
    component={ReelAd}
    durationInFrames={REEL_DURATION_IN_FRAMES}
    fps={REEL_FPS}
    width={REEL_WIDTH}
    height={REEL_HEIGHT}
    defaultProps={{
      startupName: "BrandFoundry",
      industry: "technology",
      targetAudience: "modern teams",
      description: "A clearer way to turn ideas into memorable brands.",
      logo: "",
      campaign: null,
    }}
  />
);
