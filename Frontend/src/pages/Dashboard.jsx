import React, { useEffect, useState } from "react";
import CesiumMap from "../components/CesiumMap";
import "./Dashboard.css";

function Dashboard() {
  // ============================================================
  // CURRENT DATE AND TIME
  // ============================================================

  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // ============================================================
  // LIVE FLEET TELEMETRY
  // ============================================================

  const [drones, setDrones] = useState({});

  const [lastUpdate, setLastUpdate] = useState(null);

  // ============================================================
  // CLOCK
  // ============================================================

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ============================================================
  // WEBSOCKET TELEMETRY
  // ============================================================

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8090");

    socket.onopen = () => {
      console.log("Dashboard telemetry WebSocket connected.");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        console.log("Dashboard telemetry:", data);

        if (
          !data.droneId ||
          typeof data.latitude !== "number" ||
          typeof data.longitude !== "number"
        ) {
          console.warn("Invalid dashboard telemetry:", data);
          return;
        }

        const droneId = data.droneId;

        const droneData = {
          droneId,
          latitude: data.latitude,
          longitude: data.longitude,
          altitude: Number(data.altitude) || 0,
          battery: Number(data.battery) || 0,
          status: data.status || "Unknown",
          lastUpdate: new Date(),
        };

        setDrones((previous) => ({
          ...previous,
          [droneId]: droneData,
        }));

        setLastUpdate(new Date());
      } catch (error) {
        console.error("Invalid dashboard telemetry:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("Dashboard WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("Dashboard telemetry WebSocket disconnected.");
    };

    return () => {
      socket.close();
    };
  }, []);

  // ============================================================
  // DATE / TIME FORMAT
  // ============================================================

  const date = currentDateTime.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const time = currentDateTime.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  // ============================================================
  // FLEET DATA
  // ============================================================

  const droneList = Object.values(drones).sort((a, b) =>
    a.droneId.localeCompare(b.droneId, undefined, {
      numeric: true,
    })
  );

  const totalDrones = droneList.length;

  const activeDrones = droneList.filter((drone) => {
    const status = drone.status?.toLowerCase();

    return status === "online" || status === "active";
  }).length;

  const offlineDrones = droneList.filter((drone) => {
    const status = drone.status?.toLowerCase();

    return status === "offline";
  }).length;

  const averageBattery =
    totalDrones > 0
      ? Math.round(
          droneList.reduce(
            (total, drone) => total + drone.battery,
            0
          ) / totalDrones
        )
      : 0;

  // ============================================================
  // LAST UPDATE
  // ============================================================

  const getLastUpdateText = (drone) => {
    if (!drone?.lastUpdate) {
      return "Waiting";
    }

    const seconds = Math.floor(
      (new Date() - drone.lastUpdate) / 1000
    );

    if (seconds <= 1) {
      return "Just now";
    }

    return `${seconds} sec ago`;
  };

  // ============================================================
  // LOW BATTERY DRONES
  // ============================================================

  const lowBatteryDrones = droneList.filter(
    (drone) => drone.battery <= 20
  );

  // ============================================================
  // RETURN
  // ============================================================

  return (
    <div className="dashboard">

      {/* ========================================================
          TOP BAR
      ======================================================== */}

      <div className="dashboard-topbar">

        <div>
          <h1>Dashboard</h1>
          <p>Drone Mission Control</p>
        </div>

        <div className="dashboard-date">
          <span>●</span>
          {date}
          <small>{time}</small>
        </div>

      </div>

      {/* ========================================================
          LIVE STATS
      ======================================================== */}

      <div className="stats-grid">

        {/* TOTAL DRONES */}

        <div className="stat-card">

          <div className="stat-icon blue">
            <span className="drone-icon">
              ✈
            </span>
          </div>

          <div className="stat-content">

            <p>Total Drones</p>

            <h2>{totalDrones}</h2>

            <span>
              Connected telemetry drones
            </span>

          </div>

        </div>

        {/* ACTIVE DRONES */}

        <div className="stat-card">

          <div className="stat-icon green">

            <span className="drone-icon">
              ✈
            </span>

          </div>

          <div className="stat-content">

            <p>Active Drones</p>

            <h2>{activeDrones}</h2>

            <span>
              {activeDrones > 0
                ? `${activeDrones} drones online`
                : "No active drone"}
            </span>

          </div>

        </div>

        {/* OFFLINE DRONES */}

        <div className="stat-card">

          <div className="stat-icon red">

            <span className="drone-icon">
              ✈
            </span>

          </div>

          <div className="stat-content">

            <p>Offline Drones</p>

            <h2>{offlineDrones}</h2>

            <span>
              {offlineDrones > 0
                ? `${offlineDrones} drones offline`
                : "All drones connected"}
            </span>

          </div>

        </div>

        {/* ACTIVE MISSIONS */}

        <div className="stat-card">

          <div className="stat-icon purple">
            🚩
          </div>

          <div className="stat-content">

            <p>Active Missions</p>

            <h2>1</h2>

            <span>
              Currently in progress
            </span>

          </div>

        </div>

        {/* BATTERY */}

        <div className="stat-card">

          <div className="stat-icon yellow">
            🔋
          </div>

          <div className="stat-content">

            <p>Avg. Battery</p>

            <h2>{averageBattery}%</h2>

            <span>
              Live fleet battery
            </span>

          </div>

        </div>

      </div>

      {/* ========================================================
          MAP + MISSIONS
      ======================================================== */}

      <div className="dashboard-grid">

        {/* LIVE MAP */}

        <section className="map-card">

          <div className="card-header">

            <div>

              <h2>Live Map</h2>

              <span>
                Real-time drone locations
              </span>

            </div>

            <div className="live-indicator">

              <span></span>

              LIVE

            </div>

          </div>

          <div className="map-wrapper">

            <CesiumMap />

          </div>

        </section>

        {/* RECENT MISSIONS */}

        <section className="missions-card">

          <div className="card-header">

            <div>

              <h2>Recent Missions</h2>

              <span>
                Latest mission activity
              </span>

            </div>

            <button className="view-button">
              View All
            </button>

          </div>

          <div className="mission-list">

            <div className="mission-row">

              <div className="mission-info">

                <strong>M-104</strong>

                <span>
                  Survey Mission
                </span>

              </div>

              <span className="mission-status progress">
                In Progress
              </span>

            </div>

            <div className="mission-row">

              <div className="mission-info">

                <strong>M-103</strong>

                <span>
                  Mapping Mission
                </span>

              </div>

              <span className="mission-status completed">
                Completed
              </span>

            </div>

            <div className="mission-row">

              <div className="mission-info">

                <strong>M-102</strong>

                <span>
                  Inspection Mission
                </span>

              </div>

              <span className="mission-status progress">
                In Progress
              </span>

            </div>

            <div className="mission-row">

              <div className="mission-info">

                <strong>M-101</strong>

                <span>
                  Delivery Mission
                </span>

              </div>

              <span className="mission-status failed">
                Failed
              </span>

            </div>

          </div>

        </section>

      </div>

      {/* ========================================================
          LOWER GRID
      ======================================================== */}

      <div className="lower-grid">

        {/* ======================================================
            DRONE FLEET
        ====================================================== */}

        <section className="data-card">

          <div className="card-header">

            <div>

              <h2>Drone Fleet</h2>

              <span>
                Current fleet status
              </span>

            </div>

            <button className="view-button">
              View All
            </button>

          </div>

          <div className="table-container">

            <table>

              <thead>

                <tr>

                  <th>Drone ID</th>

                  <th>Status</th>

                  <th>Battery</th>

                  <th>Location</th>

                  <th>Last Update</th>

                </tr>

              </thead>

              <tbody>

                {droneList.length === 0 ? (

                  <tr>

                    <td colSpan="5">
                      Waiting for telemetry...
                    </td>

                  </tr>

                ) : (

                  droneList.map((drone) => {

                    const isOnline =
                      drone.status?.toLowerCase() ===
                        "online" ||
                      drone.status?.toLowerCase() ===
                        "active";

                    return (

                      <tr key={drone.droneId}>

                        <td>
                          <strong>
                            {drone.droneId}
                          </strong>
                        </td>

                        <td>

                          <span
                            className={
                              isOnline
                                ? "table-status active"
                                : "table-status offline"
                            }
                          >

                            ●{" "}
                            {drone.status}

                          </span>

                        </td>

                        <td>

                          <span
                            style={{
                              color:
                                drone.battery <= 20
                                  ? "#ff4444"
                                  : "inherit",
                            }}
                          >
                            {drone.battery}%
                          </span>

                        </td>

                        <td>

                          {drone.latitude.toFixed(4)},
                          {" "}
                          {drone.longitude.toFixed(4)}

                        </td>

                        <td>
                          {getLastUpdateText(drone)}
                        </td>

                      </tr>

                    );
                  })

                )}

              </tbody>

            </table>

          </div>

        </section>

        {/* ======================================================
            SYSTEM ALERTS
        ====================================================== */}

        <section className="data-card">

          <div className="card-header">

            <div>

              <h2>System Alerts</h2>

              <span>
                Important notifications
              </span>

            </div>

            <button className="view-button">
              View All
            </button>

          </div>

          <div className="alerts-list">

            {/* LOW BATTERY ALERTS */}

            {lowBatteryDrones.map((drone) => (

              <div
                className="alert-item danger"
                key={`battery-${drone.droneId}`}
              >

                <div className="alert-icon">
                  ⚠
                </div>

                <div>

                  <strong>
                    Low Battery: {drone.droneId}
                  </strong>

                  <span>
                    Battery level critical:{" "}
                    {drone.battery}%
                  </span>

                  <small>
                    {getLastUpdateText(drone)}
                  </small>

                </div>

              </div>

            ))}

            {/* OFFLINE DRONE ALERTS */}

            {droneList
              .filter(
                (drone) =>
                  drone.status?.toLowerCase() ===
                  "offline"
              )
              .map((drone) => (

                <div
                  className="alert-item danger"
                  key={`offline-${drone.droneId}`}
                >

                  <div className="alert-icon">
                    ⚠
                  </div>

                  <div>

                    <strong>
                      Drone Offline
                    </strong>

                    <span>
                      {drone.droneId} is currently
                      offline.
                    </span>

                    <small>
                      Waiting for connection
                    </small>

                  </div>

                </div>

              ))}

            {/* NORMAL TELEMETRY */}

            {droneList.length > 0 &&
              lowBatteryDrones.length === 0 &&
              offlineDrones === 0 && (

                <div className="alert-item info">

                  <div className="alert-icon">
                    ℹ
                  </div>

                  <div>

                    <strong>
                      Telemetry Connected
                    </strong>

                    <span>
                      {totalDrones} drones are
                      sending live telemetry.
                    </span>

                    <small>
                      {lastUpdate
                        ? "Live"
                        : "Waiting"}
                    </small>

                  </div>

                </div>

              )}

            {/* MISSION ALERT */}

            <div className="alert-item warning">

              <div className="alert-icon">
                ⚠
              </div>

              <div>

                <strong>
                  Mission M-104
                </strong>

                <span>
                  Connection unstable at
                  waypoint 5
                </span>

                <small>
                  5 min ago
                </small>

              </div>

            </div>

            {/* MAINTENANCE */}

            <div className="alert-item info">

              <div className="alert-icon">
                ℹ
              </div>

              <div>

                <strong>
                  Maintenance Due
                </strong>

                <span>
                  AG-015 maintenance in
                  2 days
                </span>

                <small>
                  1 hour ago
                </small>

              </div>

            </div>

          </div>

        </section>

      </div>

    </div>
  );
}

export default Dashboard;