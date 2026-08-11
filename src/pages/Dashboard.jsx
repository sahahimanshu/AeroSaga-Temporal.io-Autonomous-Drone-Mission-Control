/*import { useState } from "react";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import SearchBar from "../components/SearchBar";
import ActiveMissionsPanel from "../components/ActiveMissionsPanel";
import SelectedDronePanel from "../components/SelectedDronePanel";
import EmergencyAbortButton from "../components/EmergencyAbortButton";
import { mockStats } from "../data/mockStats";

export default function Dashboard() {
  const [query, setQuery] = useState("");

  const handleAbort = () => {
    alert("Emergency Abort triggered (mock) — this will call the backend Signal Method later.");
  };

  return (
    <div className="page-container">
      <div className="page-header-with-search">
        <Header
          title="MyDrones"
          subtitle="Real-time overview of your drone missions and fleet"
        />
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search drones by ID or name..."
        />
      </div>

      <div className="stats-row">
        {mockStats.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-left">
          <div className="panel map-placeholder">
            <h3>Live Map</h3>
            <p className="panel-subtext">Real-time drone positions</p>
            <div className="map-box">🗺️ CesiumJS 3D map will render here (later step)</div>
          </div>
          <SelectedDronePanel />
        </div>

        <div className="dashboard-right">
          <ActiveMissionsPanel />
        </div>
      </div>

      <EmergencyAbortButton onAbort={handleAbort} />
    </div>
  );
} */

/*
import LiveMap from "../components/LiveMap";  
import BackToAdminButton from "../components/BackToAdminButton";
import { useState } from "react";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import ActiveMissionsPanel from "../components/ActiveMissionsPanel";
import SelectedDronePanel from "../components/SelectedDronePanel";
import EmergencyAbortButton from "../components/EmergencyAbortButton";

export default function Dashboard() {
  const [query, setQuery] = useState("");

  const handleAbort = () => {
    alert("Emergency Abort triggered (mock) — this will call the backend Signal Method later.");
  };

  return (
    <div className="page-container">
        <BackToAdminButton />
      <div className="page-header-with-search">
        <Header
          title="MyDrones"
          subtitle="Real-time overview of your drone missions and fleet"
        />
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search drones by ID or name..."
        />
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-left">
          <div className="panel map-placeholder">
  <h3>Live Map</h3>
  <p className="panel-subtext">Real-time drone positions</p>
  <LiveMap />
</div>
          <SelectedDronePanel />
        </div>

        <div className="dashboard-right">
          <ActiveMissionsPanel />
        </div>
      </div>

      <EmergencyAbortButton onAbort={handleAbort} />
    </div>
  );
} */

  import { useState } from "react";
import SearchBar from "../components/SearchBar";
import BackToAdminButton from "../components/BackToAdminButton";
import LiveMap from "../components/LiveMap";
import SelectedDronePanel from "../components/SelectedDronePanel";
import { mockDrones } from "../data/mockDrones";

export default function Dashboard() {
  const [query, setQuery] = useState("");

  const matchedDrone = mockDrones.find(
    (drone) =>
      drone.id.toLowerCase().includes(query.toLowerCase()) ||
      drone.name.toLowerCase().includes(query.toLowerCase())
  );

  // If nothing typed yet, default to showing the first drone
const droneToShow = query ? matchedDrone : null;
  return (
    <div className="page-container">
      <BackToAdminButton />

      <div className="page-header-with-search">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search drones by ID or name..."
        />
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-left">
          <div className="panel map-placeholder">
            <h3>Live Map</h3>
            <p className="panel-subtext">Real-time drone positions</p>
            <LiveMap selectedDroneId={droneToShow?.id} />
          </div>
        </div>

        <div className="dashboard-right">
          <SelectedDronePanel drone={droneToShow} />
        </div>
      </div>
    </div>
  );
}