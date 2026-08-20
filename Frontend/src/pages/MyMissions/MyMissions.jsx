import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CesiumMap from "../../components/CesiumMap";
import "./MyMissions.css";

function MyMissions() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [showResults, setShowResults] = useState(false);

  const drones = [
    {
      id: "DR-001",
      name: "Delivery Unit 1",
      battery: 92,
      speed: 45,
      altitude: 120,
      signal: "Strong",
      location: "18.5204° N, 73.8567° E",
      status: "Active",
    },
    {
      id: "DR-002",
      name: "Delivery Unit 2",
      battery: 81,
      speed: 42,
      altitude: 110,
      signal: "Strong",
      location: "18.5400° N, 73.8700° E",
      status: "Active",
    },
    {
      id: "DR-003",
      name: "Delivery Unit 3",
      battery: 74,
      speed: 38,
      altitude: 95,
      signal: "Good",
      location: "18.5300° N, 73.8600° E",
      status: "Active",
    },
    {
      id: "DR-004",
      name: "Delivery Unit 4",
      battery: 61,
      speed: 35,
      altitude: 105,
      signal: "Good",
      location: "18.5600° N, 73.8900° E",
      status: "Active",
    },
    {
      id: "DR-005",
      name: "Delivery Unit 5",
      battery: 88,
      speed: 44,
      altitude: 115,
      signal: "Strong",
      location: "18.5700° N, 73.9000° E",
      status: "Active",
    },
    {
      id: "DR-006",
      name: "Delivery Unit 6",
      battery: 68,
      speed: 40,
      altitude: 100,
      signal: "Strong",
      location: "18.5500° N, 73.8800° E",
      status: "Active",
    },
  ];

  const [selectedDrone, setSelectedDrone] = useState(drones[5]);

  const filteredDrones = drones.filter((drone) =>
    drone.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setShowResults(true);
  };

  const handleDroneSelect = (drone) => {
    setSelectedDrone(drone);
    setSearch(drone.id);
    setShowResults(false);
  };

  return (
    <div className="my-missions-page">

      {/* Back Button */}
      <button
        className="missions-back-button"
        onClick={() => navigate("/dashboard")}
      >
        ←
      </button>

      {/* Search */}
      <div className="drone-search-wrapper">
        <div className="drone-search-container">
          <span className="search-icon">⌕</span>

          <input
            type="text"
            placeholder="Search drone..."
            value={search}
            onChange={handleSearchChange}
            onFocus={() => setShowResults(true)}
          />

          {search && (
            <button
              className="clear-search"
              onClick={() => {
                setSearch("");
                setShowResults(false);
              }}
            >
              ×
            </button>
          )}
        </div>

        {/* Search Results */}
        {showResults && search && (
          <div className="search-results">
            {filteredDrones.length > 0 ? (
              filteredDrones.map((drone) => (
                <div
                  key={drone.id}
                  className="search-result-item"
                  onClick={() => handleDroneSelect(drone)}
                >
                  <span className="result-dot"></span>

                  <div>
                    <strong>{drone.id}</strong>
                    <small>{drone.name}</small>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                No drone found
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="missions-content">

        {/* Live Map */}
        <div className="live-map-card">

          <div className="map-header">
            <div>
              <h2>Live Map</h2>
              <p>Real-time drone positions</p>
            </div>

            <span className="map-live-status">
              <span></span>
              LIVE
            </span>
          </div>

          <div className="cesium-map-container">
            <CesiumMap />
          </div>

        </div>

        {/* Selected Drone */}
        <div className="selected-drone-card">

          <div className="selected-drone-top">

            <div>
              <div className="selected-label">
                SELECTED DRONE
              </div>

              <div className="selected-drone-title">
                <div className="drone-status-dot"></div>

                <h2>{selectedDrone.id}</h2>

                <span className="active-badge">
                  {selectedDrone.status}
                </span>
              </div>

              <p className="drone-name">
                {selectedDrone.name}
              </p>
            </div>

            <div className="live-pill">
              <span></span>
              LIVE
            </div>

          </div>

          <div className="drone-divider"></div>

          {/* Drone Information */}
          <div className="drone-details">

            <div className="detail-item">
              <span>Battery</span>
              <strong>{selectedDrone.battery}%</strong>

              <div className="battery-bar">
                <div
                  style={{
                    width: `${selectedDrone.battery}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="detail-item">
              <span>Speed</span>
              <strong>{selectedDrone.speed} km/h</strong>
            </div>

            <div className="detail-item">
              <span>Altitude</span>
              <strong>{selectedDrone.altitude} m</strong>
            </div>

            <div className="detail-item">
              <span>Signal</span>

              <strong className="signal-value">
                <span></span>
                {selectedDrone.signal}
              </strong>
            </div>

          </div>

          {/* Location */}
          <div className="location-box">
            <span>Current Location</span>

            <strong>
              📍 {selectedDrone.location}
            </strong>
          </div>

        </div>

      </div>
    </div>
  );
}

export default MyMissions;