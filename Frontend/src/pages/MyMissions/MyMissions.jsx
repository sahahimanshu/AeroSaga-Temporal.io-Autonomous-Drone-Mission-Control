import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CesiumMap from "../../components/CesiumMap";
import "./MyMissions.css";

function MyMissions() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [telemetryDrones, setTelemetryDrones] = useState({});
  const [selectedDrone, setSelectedDrone] = useState(null);

  
  const defaultDrones = Array.from({ length: 50 }, (_, index) => {
    const number = String(index + 1).padStart(2, "0");

    return {
      droneId: `M-${number}`,
      name: `Delivery Unit ${index + 1}`,
      battery: 75,
      speed: 40,
      altitude: 100,
      signal: "Strong",
      latitude: 18.5204 + index * 0.01,
      longitude: 73.8567 + index * 0.01,
      status: "Active",
    };
  });


  const drones = defaultDrones.map((drone) => {
    const live = telemetryDrones[drone.droneId];

    return live
      ? {
          ...drone,
          ...live,
        }
      : drone;
  });

  
  useEffect(() => {
    if (!selectedDrone && drones.length > 0) {
      setSelectedDrone(drones[0]);
    }
  }, []);

 
  useEffect(() => {
    const handleTelemetry = (event) => {
      const telemetry = event.detail;

      if (!telemetry || !telemetry.droneId) {
        return;
      }

      setTelemetryDrones((previous) => ({
        ...previous,
        [telemetry.droneId]: telemetry,
      }));

      setSelectedDrone((current) => {
        if (!current) {
          return current;
        }

        if (current.droneId === telemetry.droneId) {
          return {
            ...current,
            ...telemetry,
          };
        }

        return current;
      });
    };

    window.addEventListener("drone-telemetry", handleTelemetry);

    return () => {
      window.removeEventListener("drone-telemetry", handleTelemetry);
    };
  }, []);

  
  const filteredDrones = drones.filter((drone) => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return false;
    }

    return (
      drone.droneId.toLowerCase().includes(value) ||
      drone.name.toLowerCase().includes(value)
    );
  });

  
  const visibleResults = filteredDrones.slice(0, 3);

  const handleSearchChange = (event) => {
    const value = event.target.value;

    setSearch(value);
    setShowResults(true);
  };

  const handleDroneSelect = (drone) => {
    const latestTelemetry = telemetryDrones[drone.droneId];

    const updatedDrone = latestTelemetry
      ? {
          ...drone,
          ...latestTelemetry,
        }
      : drone;

    setSelectedDrone(updatedDrone);
    setSearch(drone.droneId);
    setShowResults(false);
  };

  
  const handleSearchKeyDown = (event) => {
    if (event.key !== "Enter") {
      return;
    }

    const value = search.trim().toLowerCase();

    if (!value) {
      return;
    }

    const exactDrone = drones.find(
      (drone) =>
        drone.droneId.toLowerCase() === value ||
        drone.name.toLowerCase() === value
    );

    if (exactDrone) {
      handleDroneSelect(exactDrone);
      return;
    }

    
    const numberMatch = value.match(/\d+/);

    if (numberMatch) {
      const number = String(parseInt(numberMatch[0], 10)).padStart(2, "0");

      const droneId = `M-${number}`;

      const droneByNumber = drones.find(
        (drone) => drone.droneId.toLowerCase() === droneId.toLowerCase()
      );

      if (droneByNumber) {
        handleDroneSelect(droneByNumber);
      }
    }
  };

  const clearSearch = () => {
    setSearch("");
    setShowResults(false);
  };

 
  useEffect(() => {
    if (!selectedDrone?.droneId) {
      return;
    }

    const live = telemetryDrones[selectedDrone.droneId];

    if (live) {
      setSelectedDrone((current) => ({
        ...current,
        ...live,
      }));
    }
  }, [telemetryDrones]);

  const drone = selectedDrone || drones[0];

  
  const battery =
    drone?.battery !== undefined ? Number(drone.battery) : 0;

  const speed =
    drone?.speed !== undefined && drone?.speed !== null
      ? drone.speed
      : "N/A";

  const altitude =
    drone?.altitude !== undefined && drone?.altitude !== null
      ? drone.altitude
      : "N/A";

  const signal =
    drone?.signal !== undefined && drone?.signal !== null
      ? drone.signal
      : "N/A";

  const latitude =
    drone?.latitude !== undefined ? Number(drone.latitude) : null;

  const longitude =
    drone?.longitude !== undefined ? Number(drone.longitude) : null;

  const location =
    latitude !== null &&
    longitude !== null &&
    !Number.isNaN(latitude) &&
    !Number.isNaN(longitude)
      ? `${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E`
      : "Location unavailable";

  const droneName =
    drone?.name ||
    (drone?.droneId
      ? `Delivery Unit ${String(drone.droneId).replace(/^M-/i, "")}`
      : "Drone");

  return (
    <div className="my-missions-page">

      

      <button
        className="missions-back-button"
        onClick={() => navigate("/dashboard")}
      >
        ←
      </button>

     

      <div className="drone-search-wrapper">
        <div className="drone-search-container">

          <span className="search-icon">
            ⌕
          </span>

          <input
            type="text"
            placeholder="Search drone..."
            value={search}
            onChange={handleSearchChange}
            onFocus={() => {
              if (search.trim()) {
                setShowResults(true);
              }
            }}
            onKeyDown={handleSearchKeyDown}
          />

          {search && (
            <button
              className="clear-search"
              onClick={clearSearch}
            >
              ×
            </button>
          )}
        </div>

       

        {showResults && search.trim() && (
          <div className="search-results">

            {visibleResults.length > 0 ? (
              visibleResults.map((item) => (
                <div
                  key={item.droneId}
                  className="search-result-item"
                  onClick={() => handleDroneSelect(item)}
                >
                  <span className="result-dot"></span>

                  <div>
                    <strong>
                      {item.droneId}
                    </strong>

                    <small>
                      {item.name}
                    </small>
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

  

      <div className="missions-content">

        

        <div className="live-map-card">

          <div className="map-header">

            <div>
              <h2>
                Live Map
              </h2>

              <p>
                Real-time drone positions
              </p>
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

        

        <div className="right-side-column">

          <div className="selected-drone-card">

            <div className="selected-drone-top">

              <div>

                <div className="selected-label">
                  SELECTED DRONE
                </div>

                <div className="selected-drone-title">

                  <div className="drone-status-dot"></div>

                  <h2>
                    {drone?.droneId || "N/A"}
                  </h2>

                  <span className="active-badge">
                    {drone?.status || "Active"}
                  </span>

                </div>

                <p className="drone-name">
                  {droneName}
                </p>

              </div>

              <div className="live-pill">
                <span></span>
                LIVE
              </div>

            </div>

            <div className="drone-divider"></div>

           

            <div className="drone-details">

              <div className="detail-item">

                <span>
                  Battery
                </span>

                <strong>
                  {Number.isNaN(battery)
                    ? "N/A"
                    : `${battery}%`}
                </strong>

                <div className="battery-bar">
                  <div
                    style={{
                      width: `${Math.max(
                        0,
                        Math.min(100, battery)
                      )}%`,
                    }}
                  ></div>
                </div>

              </div>

              <div className="detail-item">

                <span>
                  Speed
                </span>

                <strong>
                  {speed === "N/A"
                    ? "N/A"
                    : `${speed} km/h`}
                </strong>

              </div>

              <div className="detail-item">

                <span>
                  Altitude
                </span>

                <strong>
                  {altitude === "N/A"
                    ? "N/A"
                    : `${altitude} m`}
                </strong>

              </div>

              <div className="detail-item">

                <span>
                  Signal
                </span>

                <strong className="signal-value">

                  <span></span>

                  {signal}

                </strong>

              </div>

            </div>

           

            <div className="location-box">

              <span>
                Current Location
              </span>

              <strong>
                📍 {location}
              </strong>

            </div>

          </div>

        </div>

        

        <div className="mission-workflow-card">

          <div className="workflow-header">

            <div>
              <h2>
                Mission Workflow
              </h2>

              <p>
                Live mission execution status
              </p>
            </div>

            <div className="workflow-live">
              <span></span>
              LIVE
            </div>

          </div>

          <div className="workflow-steps">

          

            <div className="workflow-step completed">

              <div className="step-circle">
                ✓
              </div>

              <div className="step-content">

                <strong>
                  Takeoff
                </strong>

                <span>
                  Completed
                </span>

              </div>

            </div>

            <div className="workflow-arrow">
              →
            </div>

            
            <div className="workflow-step active">

              <div className="step-circle">
                2
              </div>

              <div className="step-content">

                <strong>
                  Mission Active
                </strong>

                <span>
                  Active
                </span>

              </div>

            </div>

            <div className="workflow-arrow">
              →
            </div>

            

            <div className="workflow-step pending">

              <div className="step-circle">
                3
              </div>

              <div className="step-content">

                <strong>
                  Drop Package
                </strong>

                <span>
                  Pending
                </span>

              </div>

            </div>

            <div className="workflow-arrow">
              →
            </div>


            <div className="workflow-step pending">

              <div className="step-circle">
                4
              </div>

              <div className="step-content">

                <strong>
                  Return to Base
                </strong>

                <span>
                  Pending
                </span>

              </div>

            </div>

            <div className="workflow-arrow">
              →
            </div>

            
            <div className="workflow-step pending">

              <div className="step-circle">
                5
              </div>

              <div className="step-content">

                <strong>
                  Completed
                </strong>

                <span>
                  Pending
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default MyMissions;