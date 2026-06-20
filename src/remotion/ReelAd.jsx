import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  useCurrentFrame,
} from "remotion";

export const REEL_FPS = 30;
export const REEL_DURATION_IN_FRAMES = 450;
export const REEL_WIDTH = 720;
export const REEL_HEIGHT = 1280;

const palette = [
  { start: "#071c27", end: "#175b66", accent: "#ff896d" },
  { start: "#17152f", end: "#573b82", accent: "#f6b4ff" },
  { start: "#0b2822", end: "#26715a", accent: "#81e1bd" },
  { start: "#30200d", end: "#8b5722", accent: "#ffd27e" },
];

const writeString = (view, offset, value) => {
  for (let index = 0; index < value.length; index += 1) {
    view.setUint8(offset + index, value.charCodeAt(index));
  }
};

const createSoundtrackDataUri = () => {
  const sampleRate = 22050;
  const durationInSeconds = REEL_DURATION_IN_FRAMES / REEL_FPS;
  const channelCount = 1;
  const bytesPerSample = 2;
  const sampleCount = Math.ceil(sampleRate * durationInSeconds);
  const dataSize = sampleCount * channelCount * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, channelCount, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * channelCount * bytesPerSample, true);
  view.setUint16(32, channelCount * bytesPerSample, true);
  view.setUint16(34, bytesPerSample * 8, true);
  writeString(view, 36, "data");
  view.setUint32(40, dataSize, true);

  const notes = [110, 146.83, 164.81, 196, 220, 261.63];
  const beatLength = 0.5;

  for (let sample = 0; sample < sampleCount; sample += 1) {
    const time = sample / sampleRate;
    const beat = Math.floor(time / beatLength);
    const beatProgress = (time % beatLength) / beatLength;
    const chordRoot = notes[Math.floor(time / 2.5) % notes.length];
    const pulseEnvelope = Math.exp(-beatProgress * 7);
    const barEnvelope = 0.75 + 0.25 * Math.sin(2 * Math.PI * time / 5);
    const bass =
      Math.sin(2 * Math.PI * chordRoot * time) * 0.22 * barEnvelope;
    const fifth =
      Math.sin(2 * Math.PI * chordRoot * 1.5 * time) * 0.09 * barEnvelope;
    const shimmer =
      Math.sin(2 * Math.PI * chordRoot * 4 * time) * 0.035 *
      (0.5 + 0.5 * Math.sin(2 * Math.PI * time / 1.5));
    const kick =
      Math.sin(2 * Math.PI * (58 - beatProgress * 25) * time) *
      pulseEnvelope *
      (beat % 2 === 0 ? 0.32 : 0.16);
    const fadeIn = Math.min(1, time / 0.25);
    const fadeOut = Math.min(1, (durationInSeconds - time) / 0.6);
    const mixed = (bass + fifth + shimmer + kick) * fadeIn * fadeOut;
    const clamped = Math.max(-1, Math.min(1, mixed));

    view.setInt16(44 + sample * 2, clamped * 32767, true);
  }

  let binary = "";
  const bytes = new Uint8Array(buffer);

  for (let index = 0; index < bytes.length; index += 1) {
    binary += String.fromCharCode(bytes[index]);
  }

  return `data:audio/wav;base64,${btoa(binary)}`;
};

const SOUNDTRACK_SRC = createSoundtrackDataUri();

const fallbackScenes = ({
  startupName,
  industry,
  targetAudience,
  description,
}) => [
  {
    purpose: "Hook",
    headline: `What is slowing ${targetAudience || "your customers"} down?`,
    subheadline: `The old way of working in ${industry || "this industry"} was not built for what comes next.`,
  },
  {
    purpose: "Problem",
    headline: "Complexity costs attention.",
    subheadline: "Every extra step makes the right decision harder to reach.",
  },
  {
    purpose: "Value",
    headline: `${startupName} makes the next move clearer.`,
    subheadline: description || "A focused solution built around a real customer need.",
  },
  {
    purpose: "Reason to act",
    headline: "Move with confidence.",
    subheadline: `Built specifically for ${targetAudience || "the people who need it"}.`,
  },
];

const MotionBackdrop = ({ colors, sceneIndex, frame }) => {
  const travel = interpolate(frame, [0, 105], [-90, 110], {
    extrapolateRight: "clamp",
  });
  const spin = interpolate(frame, [0, 105], [-8, 18], {
    extrapolateRight: "clamp",
  });

  return (
    <>
      <AbsoluteFill
        style={{
          background: `linear-gradient(150deg, ${colors.start}, ${colors.end})`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.1,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.35) 1px, transparent 1px)",
          backgroundSize: sceneIndex % 2 ? "54px 54px" : "68px 68px",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 100 - travel * 0.3,
          right: -250 + travel,
          width: 640,
          height: 640,
          border: "2px solid rgba(255,255,255,.12)",
          borderRadius: sceneIndex % 2 ? 180 : "50%",
          boxShadow: `inset 0 0 180px ${colors.accent}22`,
          transform: `rotate(${spin}deg)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -250 - travel * 0.25,
          bottom: 40,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `${colors.accent}20`,
          filter: "blur(5px)",
        }}
      />
    </>
  );
};

const CampaignScene = ({
  scene,
  sceneIndex,
  startupName,
  frame,
}) => {
  const colors = palette[sceneIndex % palette.length];
  const entrance = spring({
    frame,
    fps: REEL_FPS,
    config: { damping: 17, stiffness: 115, mass: 0.8 },
  });
  const opacity = 1;
  const titleY = interpolate(entrance, [0, 1], [100, 0]);
  const lineWidth = interpolate(frame, [0, 30], [130, 160], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subtitleOpacity = 1;

  return (
    <AbsoluteFill
      style={{
        opacity,
        overflow: "hidden",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <MotionBackdrop colors={colors} sceneIndex={sceneIndex} frame={frame} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          padding: "86px 62px 58px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 17,
            fontWeight: 800,
            letterSpacing: 3.4,
            textTransform: "uppercase",
          }}
        >
          <span style={{ color: colors.accent }}>{scene.purpose}</span>
          <span style={{ color: "rgba(255,255,255,.62)" }}>
            0{sceneIndex + 1}
          </span>
        </div>

        <div
          style={{
            marginBlock: "auto",
            transform: `translateY(${titleY}px)`,
          }}
        >
          <div
            style={{
              width: lineWidth,
              height: 7,
              marginBottom: 30,
              borderRadius: 99,
              background: colors.accent,
            }}
          />
          <h1
            style={{
              maxWidth: 600,
              margin: 0,
              color: "#fffaf4",
              fontFamily: "Georgia, serif",
              fontSize: scene.headline.length > 62 ? 61 : 76,
              fontWeight: 500,
              letterSpacing: -3.2,
              lineHeight: 1.03,
            }}
          >
            {scene.headline}
          </h1>
          <p
            style={{
              maxWidth: 560,
              margin: "34px 0 0",
              opacity: subtitleOpacity,
              color: "rgba(255,255,255,.82)",
              fontSize: 27,
              lineHeight: 1.42,
            }}
          >
            {scene.subheadline}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "rgba(255,255,255,.58)",
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          <span>{startupName}</span>
          <div style={{ display: "flex", gap: 7 }}>
            {palette.map((_, index) => (
              <span
                key={index}
                style={{
                  width: index === sceneIndex ? 28 : 7,
                  height: 7,
                  borderRadius: 99,
                  background:
                    index === sceneIndex
                      ? colors.accent
                      : "rgba(255,255,255,.28)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const BrandOutro = ({ startupName, cta, durationInFrames, frame }) => {
  const entrance = spring({
    frame,
    fps: REEL_FPS,
    config: { damping: 15, stiffness: 90 },
  });
  const opacity = 1;
  const logoScale = interpolate(entrance, [0, 1], [0.55, 1]);
  const ringScale = interpolate(frame, [0, durationInFrames], [0.75, 1.18]);

  return (
    <AbsoluteFill
      style={{
        opacity,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at 50% 35%, rgba(255,137,109,.34), transparent 28%), linear-gradient(155deg,#102c39,#06141b)",
        color: "white",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 620,
          height: 620,
          border: "2px solid rgba(255,255,255,.08)",
          borderRadius: "50%",
          transform: `scale(${ringScale})`,
          boxShadow:
            "0 0 0 90px rgba(255,255,255,.025),0 0 0 180px rgba(255,255,255,.014)",
        }}
      />
      <div
        style={{
          zIndex: 1,
          width: 190,
          height: 190,
          padding: 18,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          borderRadius: 42,
          background: "white",
          boxShadow: "0 32px 75px rgba(0,0,0,.34)",
          transform: `scale(${logoScale})`,
        }}
      >
        <span
          style={{
            color: "#102c39",
            fontFamily: "Georgia, serif",
            fontSize: 90,
          }}
        >
          {startupName?.charAt(0)?.toUpperCase() || "B"}
        </span>
      </div>

      <div style={{ zIndex: 1, marginTop: 44, paddingInline: 52 }}>
        <span
          style={{
            color: "#ff896d",
            fontSize: 17,
            fontWeight: 800,
            letterSpacing: 5,
            textTransform: "uppercase",
          }}
        >
          Your next move
        </span>
        <h1
          style={{
            margin: "14px 0 0",
            fontFamily: "Georgia, serif",
            fontSize: 76,
            fontWeight: 500,
            letterSpacing: -3,
            lineHeight: 1,
          }}
        >
          {startupName}
        </h1>
        <p
          style={{
            maxWidth: 560,
            margin: "28px auto 0",
            color: "rgba(255,255,255,.83)",
            fontSize: 27,
            lineHeight: 1.4,
          }}
        >
          {cta}
        </p>
        <div
          style={{
            width: "fit-content",
            margin: "38px auto 0",
            padding: "17px 28px",
            borderRadius: 999,
            background: "#ff896d",
            fontSize: 19,
            fontWeight: 800,
          }}
        >
          Take the next step →
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const ReelAd = ({
  startupName = "Your startup",
  industry = "your industry",
  targetAudience = "your audience",
  description = "",
  campaign = null,
}) => {
  const frame = useCurrentFrame();

  if (frame === 0 || frame === 150 || frame === 330) {
    console.log("Rendering frame", frame);
  }

  const scenes =
    campaign?.scenes?.length === 4
      ? campaign.scenes
      : fallbackScenes({
          startupName,
          industry,
          targetAudience,
          description,
        });
  const cta =
    campaign?.cta || `Discover what ${startupName} can do for your business.`;
  const sceneTimings = [
    { from: 0, duration: 75 },
    { from: 75, duration: 75 },
    { from: 150, duration: 105 },
    { from: 255, duration: 75 },
  ];
  const activeSceneIndex = sceneTimings.findIndex(
    ({ from, duration }) => frame >= from && frame < from + duration
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#071c27" }}>
      <Audio src={SOUNDTRACK_SRC} volume={0.28} />
      {activeSceneIndex >= 0 && (
        <CampaignScene
          scene={scenes[activeSceneIndex]}
          sceneIndex={activeSceneIndex}
          startupName={startupName}
          frame={frame - sceneTimings[activeSceneIndex].from}
        />
      )}
      {frame >= 330 && (
        <BrandOutro
          startupName={startupName}
          cta={cta}
          durationInFrames={120}
          frame={frame - 330}
        />
      )}
    </AbsoluteFill>
  );
};
