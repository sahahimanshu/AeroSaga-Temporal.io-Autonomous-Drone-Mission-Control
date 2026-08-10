import MissionCard from "./MissionCard";
import { mockMissions } from "../data/mockMissions";

export default function ActiveMissionsPanel() {
  return (
    <div className="panel">
      <div className="panel-header">
        <h3>My Active Missions</h3>
        <span className="panel-link">View All</span>
      </div>
      <div className="mission-list">
        {mockMissions.map((m) => (
          <MissionCard key={m.id} {...m} />
        ))}
      </div>
    </div>
  );
}