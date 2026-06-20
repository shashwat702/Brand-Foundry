function OutroCard({
  startupName,
  logo,
  cta = "Discover what’s next",
}) {
  return (
    <article className="reel-frame reel-outro">
      <div className="reel-outro-ring" aria-hidden="true" />

      <div className="reel-outro-logo">
        {logo ? (
          <img src={logo} alt={`${startupName} logo`} />
        ) : (
          <span>{startupName?.charAt(0)?.toUpperCase() || "B"}</span>
        )}
      </div>

      <span className="reel-outro-label">Meet</span>
      <h3>{startupName}</h3>
      <p>{cta}</p>
      <span className="reel-outro-action">Learn more →</span>
    </article>
  );
}

export default OutroCard;
