function SceneCard({
  eyebrow,
  title,
  subtitle,
  background,
  accent,
  sceneNumber,
}) {
  return (
    <article
      className="reel-frame reel-scene"
      style={{
        "--reel-background": background,
        "--reel-accent": accent,
      }}
    >
      <div className="reel-grid" aria-hidden="true" />
      <div className="reel-orb reel-orb-one" aria-hidden="true" />
      <div className="reel-orb reel-orb-two" aria-hidden="true" />

      <div className="reel-scene-top">
        <span>{eyebrow}</span>
        <span>{String(sceneNumber).padStart(2, "0")}</span>
      </div>

      <div className="reel-scene-copy">
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>

      <div className="reel-scene-footer">
        <span className="reel-pulse" />
        <span>BrandFoundry Studio</span>
      </div>
    </article>
  );
}

export default SceneCard;
