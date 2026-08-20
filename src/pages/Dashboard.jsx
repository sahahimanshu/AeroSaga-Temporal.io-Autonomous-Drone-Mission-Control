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

import { useMemo, useState } from "react";
import SearchBar from "../components/SearchBar";
import BackToAdminButton from "../components/BackToAdminButton";
import LiveMap from "../components/LiveMap";
import SelectedDronePanel from "../components/SelectedDronePanel";
import { useSimulatedTelemetry } from "../hooks/useSimulatedTelemetry";
const statusOptions = ["All", "Active", "In Progress", "Returning", "Standby"];

export default function Dashboard() {
  const [query, setQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");
    const liveDrones = useSimulatedTelemetry(2000);

  const filteredDrones = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return liveDrones.filter((drone) => {
      const matchesQuery =
        !normalizedQuery ||
        drone.id.toLowerCase().includes(normalizedQuery) ||
        drone.name.toLowerCase().includes(normalizedQuery);

      const matchesStatus =
        activeStatus === "All" || drone.status === activeStatus;

      return matchesQuery && matchesStatus;
    });
  }, [liveDrones, activeStatus, query]);
  const droneToShow = filteredDrones[0] || null;

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

      <div className="status-filter-row" aria-label="Drone status filters">
        {statusOptions.map((status) => (
          <button
            key={status}
            type="button"
            className={status === activeStatus ? "status-filter active" : "status-filter"}
            onClick={() => setActiveStatus(status)}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-left">
          <div className="panel map-placeholder">
            <h3>Live Map</h3>
            <p className="panel-subtext">
              {filteredDrones.length
                ? `Showing ${filteredDrones.length} drone${filteredDrones.length > 1 ? "s" : ""}`
                : "No drones match the current filters"}
            </p>
            <LiveMap selectedDroneId={droneToShow?.id} drones={liveDrones} />
          </div>
        </div>

        <div className="dashboard-right">
          <SelectedDronePanel drone={droneToShow} />
        </div>
      </div>
    </div>
  );
}