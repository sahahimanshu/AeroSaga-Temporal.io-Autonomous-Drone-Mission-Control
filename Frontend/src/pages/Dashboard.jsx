import React, { useEffect, useState } from "react";
import CesiumMap from "../components/CesiumMap";
import "./Dashboard.css";

function Dashboard() {
  // ============================================================
  // CURRENT DATE AND TIME
  // ============================================================

  const [currentDateTime, setCurrentDateTime] =
    useState(new Date());

  // ============================================================
  // LIVE TELEMETRY
  // ============================================================

  const [telemetry, setTelemetry] = useState({
    droneId: "M-102",
    latitude: 22.5726,
    longitude: 88.3639,
    altitude: 120,
    battery: 100,
    status: "Connecting",
  });

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
    const socket = new WebSocket(
      "ws://localhost:8081"
    );

    socket.onopen = () => {
      console.log(
        "Dashboard telemetry WebSocket connected."
      );

      setTelemetry((previous) => ({
        ...previous,
        status: "Online",
      }));
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        console.log(
          "Dashboard telemetry:",
          data
        );

        setTelemetry((previous) => ({
          ...previous,
          ...data,
        }));

        setLastUpdate(new Date());
      } catch (error) {
        console.error(
          "Invalid dashboard telemetry:",
          error
        );
      }
    };

    socket.onerror = (error) => {
      console.error(
        "Dashboard WebSocket error:",
        error
      );
    };

    socket.onclose = () => {
      console.log(
        "Dashboard telemetry WebSocket disconnected."
      );

      setTelemetry((previous) => ({
        ...previous,
        status: "Offline",
      }));
    };

    return () => {
      socket.close();
    };
  }, []);

  // ============================================================
  // DATE / TIME FORMAT
  // ============================================================

  const date =
    currentDateTime.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  const time =
    currentDateTime.toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }
    );

  // ============================================================
  // LIVE DRONE STATUS
  // ============================================================

  const isOnline =
    telemetry.status?.toLowerCase() ===
      "online" ||
    telemetry.status?.toLowerCase() ===
      "active";

  const activeDrones = isOnline ? 1 : 0;

  const offlineDrones = isOnline ? 0 : 1;

  // ============================================================
  // LAST UPDATE
  // ============================================================

  const getLastUpdateText = () => {
    if (!lastUpdate) {
      return "Waiting for telemetry";
    }

    const seconds = Math.floor(
      (new Date() - lastUpdate) / 1000
    );

    if (seconds <= 1) {
      return "Just now";
    }

    return `${seconds} sec ago`;
  };

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

            <h2>1</h2>

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

            <h2>
              {activeDrones}
            </h2>

            <span>
              {isOnline
                ? "Drone online"
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

            <h2>
              {offlineDrones}
            </h2>

            <span>
              Current connection status
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

            <h2>
              {telemetry.battery}%
            </h2>

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

                <tr>

                  <td>
                    {telemetry.droneId}
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
                      {telemetry.status}

                    </span>

                  </td>

                  <td>
                    {telemetry.battery}%
                  </td>

                  <td>
                    {telemetry.latitude.toFixed(4)},
                    {" "}
                    {telemetry.longitude.toFixed(4)}
                  </td>

                  <td>
                    {getLastUpdateText()}
                  </td>

                </tr>

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

            {/* LOW BATTERY ALERT */}

            {telemetry.battery <= 20 && (

              <div className="alert-item danger">

                <div className="alert-icon">
                  ⚠
                </div>

                <div>

                  <strong>
                    Low Battery:{" "}
                    {telemetry.droneId}
                  </strong>

                  <span>
                    Battery level critical:{" "}
                    {telemetry.battery}%
                  </span>

                  <small>
                    {getLastUpdateText()}
                  </small>

                </div>

              </div>

            )}

            {/* CONNECTION ALERT */}

            {!isOnline && (

              <div className="alert-item danger">

                <div className="alert-icon">
                  ⚠
                </div>

                <div>

                  <strong>
                    Drone Offline
                  </strong>

                  <span>
                    {telemetry.droneId} is
                    currently offline.
                  </span>

                  <small>
                    Waiting for connection
                  </small>

                </div>

              </div>

            )}

            {/* NORMAL TELEMETRY */}

            {isOnline &&
              telemetry.battery > 20 && (

                <div className="alert-item info">

                  <div className="alert-icon">
                    ℹ
                  </div>

                  <div>

                    <strong>
                      Telemetry Connected
                    </strong>

                    <span>
                      {telemetry.droneId} is
                      sending live telemetry.
                    </span>

                    <small>
                      {getLastUpdateText()}
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