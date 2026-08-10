export default function MissionCard({ id, title, drone, status, progress }) {
  return (
    <div className="mission-card">
      <div className="mission-card-top">
        <span className="mission-id">{id}</span>
        <span className={`mission-status status-${status.replace(/\s/g, "").toLowerCase()}`}>
          {status}
        </span>
      </div>
      <div className="mission-title">{title}</div>
      <div className="mission-drone">{drone}</div>
      <div className="progress-bar-track">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="mission-progress-text">{progress}%</div>
    </div>
  );
}