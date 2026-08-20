export default function StatCard({ label, value, subtext, color }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: color }} />
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        <div className="stat-subtext">{subtext}</div>
      </div>
    </div>
  );
}