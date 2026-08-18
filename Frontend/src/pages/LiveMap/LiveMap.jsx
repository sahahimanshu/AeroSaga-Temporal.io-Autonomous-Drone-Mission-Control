import React, { useEffect, useState } from "react";
import CesiumMap from "../../components/CesiumMap";
import "./LiveMap.css";
import { useNavigate } from "react-router-dom";

function LiveMap() {
  const navigate = useNavigate();

  const [telemetry, setTelemetry] = useState({
    droneId: "M-102",
    latitude: 20.2961,
    longitude: 85.8245,
    altitude: 120,
    battery: 87,
    status: "Online",
  });

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8081");

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        setTelemetry((previous) => ({
          ...previous,
          ...data,
        }));
      } catch (error) {
        console.error("Invalid telemetry data:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <>
      <button
        className="back-button"
        onClick={() => navigate("/dashboard")}
      >
        ←
      </button>

      <div className="live-map-page">

        <div className="live-map-header">
          <div>
            <h1>Live Map</h1>
            <p>Real-time drone locations</p>
          </div>

          <div className="live-status">
            <span className="live-dot"></span>
            LIVE
          </div>
        </div>

        <div className="live-map-container">
          <CesiumMap />
        </div>

        <div className="active-drones">
          <div className="section-header">
            <h2>Active Drones</h2>
            <span>3 Online</span>
          </div>

          <div className="drone-cards">

            <div className="drone-card">
              <div className="drone-card-header">
                <h3>✈ M-101</h3>
                <span className="offline">Offline</span>
              </div>

              <div className="drone-details">
                <div>
                  <small>Battery</small>
                  <strong>32%</strong>
                </div>

                <div>
                  <small>Mission</small>
                  <strong>M-101</strong>
                </div>
              </div>

              <div className="battery">
                <div
                  className="battery-level offline-battery"
                  style={{ width: "32%" }}
                ></div>
              </div>
            </div>

            <div className="drone-card">
              <div className="drone-card-header">
                <h3>✈ {telemetry.droneId}</h3>
                <span className="online">{telemetry.status}</span>
              </div>

              <div className="drone-details">
                <div>
                  <small>Battery</small>
                  <strong>{telemetry.battery}%</strong>
                </div>

                <div>
                  <small>Altitude</small>
                  <strong>{telemetry.altitude} m</strong>
                </div>
              </div>

              <div className="battery">
                <div
                  className="battery-level"
                  style={{ width: `${telemetry.battery}%` }}
                ></div>
              </div>
            </div>

            <div className="drone-card">
              <div className="drone-card-header">
                <h3>✈ M-103</h3>
                <span className="online">Online</span>
              </div>

              <div className="drone-details">
                <div>
                  <small>Battery</small>
                  <strong>74%</strong>
                </div>

                <div>
                  <small>Mission</small>
                  <strong>M-103</strong>
                </div>
              </div>

              <div className="battery">
                <div
                  className="battery-level"
                  style={{ width: "74%" }}
                ></div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}

export default LiveMap;