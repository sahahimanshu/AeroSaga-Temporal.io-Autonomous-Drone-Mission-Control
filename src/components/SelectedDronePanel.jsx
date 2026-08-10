import { mockDrones } from "../data/mockDrones";

export default function SelectedDronePanel() {
  const drone = mockDrones[0];

  return (
    <div className="panel">
      <div className="panel-header">
        <h3>Selected Drone</h3>
        <span className="live-badge">● LIVE</span>
      </div>
      <div className="drone-id">
        {drone.id} <span className="drone-status-badge">{drone.status}</span>
      </div>
      <div className="drone-subtitle">{drone.name}</div>

      <div className="drone-stats-grid">
        <div><span className="stat-key">Battery</span><br />{drone.battery}%</div>
        <div><span className="stat-key">Speed</span><br />{drone.speed} km/h</div>
        <div><span className="stat-key">Altitude</span><br />{drone.altitude} m</div>
        <div><span className="stat-key">Signal</span><br />{drone.signal}</div>
      </div>

      <div className="drone-location">
        <span className="stat-key">Location</span><br />{drone.location}
      </div>
    </div>
  );
}