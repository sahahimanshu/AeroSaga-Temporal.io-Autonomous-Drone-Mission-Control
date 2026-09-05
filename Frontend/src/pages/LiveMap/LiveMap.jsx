import React, { useEffect, useState } from "react";
import CesiumMap from "../../components/CesiumMap";
import "./LiveMap.css";
import { useNavigate } from "react-router-dom";

const TOTAL_DRONES = 50;

function LiveMap() {
  const navigate = useNavigate();

  const [drones, setDrones] = useState({});
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let socket;
    let reconnectTimer;

    const connectWebSocket = () => {
      socket = new WebSocket("ws://localhost:8081");

      socket.onopen = () => {
        console.log("LiveMap WebSocket connected");
        setConnected(true);
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (!data.droneId) {
            return;
          }

          const droneId = data.droneId;

          setDrones((previous) => ({
            ...previous,
            [droneId]: {
              ...previous[droneId],
              ...data,
              lastUpdate: new Date(),
            },
          }));
        } catch (error) {
          console.error("Invalid telemetry data:", error);
        }
      };

      socket.onerror = (error) => {
        console.error("LiveMap WebSocket error:", error);
        setConnected(false);
      };

      socket.onclose = () => {
        console.log("LiveMap WebSocket disconnected");
        setConnected(false);

        reconnectTimer = setTimeout(() => {
          console.log("Reconnecting LiveMap WebSocket...");
          connectWebSocket();
        }, 3000);
      };
    };

    connectWebSocket();

    return () => {
      clearTimeout(reconnectTimer);

      if (socket) {
        socket.close();
      }
    };
  }, []);

 
  const droneList = Array.from(
    { length: TOTAL_DRONES },
    (_, index) => {
      const droneNumber = String(index + 1).padStart(2, "0");
      const droneId = `M-${droneNumber}`;

      return (
        drones[droneId] || {
          droneId,
          status: "Waiting",
          battery: 0,
          latitude: 0,
          longitude: 0,
          altitude: 0,
          lastUpdate: null,
        }
      );
    }
  );

  const activeDrones = droneList.filter(
    (drone) =>
      drone.status &&
      drone.status.toLowerCase() !== "offline" &&
      drone.status.toLowerCase() !== "waiting"
  );

  const lowBatteryDrones = droneList.filter(
    (drone) => Number(drone.battery) > 0 && Number(drone.battery) <= 20
  );

  const offlineDrones = droneList.filter(
    (drone) =>
      drone.status &&
      drone.status.toLowerCase() === "offline"
  );

  const getStatusClass = (status) => {
    if (!status) {
      return "offline";
    }

    const value = status.toLowerCase();

    if (value === "active" || value === "online") {
      return "online";
    }

    if (value === "offline") {
      return "offline";
    }

    if (value === "low battery") {
      return "warning";
    }

    return "warning";
  };

  const getBatteryClass = (battery) => {
    const value = Number(battery);

    if (value <= 20) {
      return "battery-critical";
    }

    if (value <= 50) {
      return "battery-warning";
    }

    return "battery-normal";
  };

  const getLastUpdate = (lastUpdate) => {
    if (!lastUpdate) {
      return "Waiting...";
    }

    const seconds = Math.floor(
      (Date.now() - new Date(lastUpdate).getTime()) / 1000
    );

    if (seconds < 5) {
      return "Just now";
    }

    if (seconds < 60) {
      return `${seconds} sec ago`;
    }

    const minutes = Math.floor(seconds / 60);

    return `${minutes} min ago`;
  };

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

            <p>
              Real-time drone locations • {TOTAL_DRONES} drones
            </p>
          </div>

          <div
            className={`live-status ${
              connected ? "connected" : "disconnected"
            }`}
          >
            <span className="live-dot"></span>

            {connected ? "LIVE" : "OFFLINE"}
          </div>

        </div>


        

        <div className="live-map-container">
          <CesiumMap />
        </div>


       

        <div className="fleet-summary">

          <div className="summary-card">

            <div className="summary-icon">
              ✈
            </div>

            <div>
              <small>Total Drones</small>
              <strong>{TOTAL_DRONES}</strong>
            </div>

          </div>


          <div className="summary-card">

            <div className="summary-icon active-icon">
              ●
            </div>

            <div>
              <small>Active</small>
              <strong>{activeDrones.length}</strong>
            </div>

          </div>


          <div className="summary-card">

            <div className="summary-icon warning-icon">
              ⚠
            </div>

            <div>
              <small>Low Battery</small>
              <strong>{lowBatteryDrones.length}</strong>
            </div>

          </div>


          <div className="summary-card">

            <div className="summary-icon offline-icon">
              ×
            </div>

            <div>
              <small>Offline</small>
              <strong>{offlineDrones.length}</strong>
            </div>

          </div>

        </div>


       

        <div className="active-drones">

          <div className="section-header">

            <div>
              <h2>Drone Fleet</h2>

              <p>
                Live telemetry from all {TOTAL_DRONES} drones
              </p>
            </div>

            <span className="online-count">
              ● {activeDrones.length} Active
            </span>

          </div>


          <div className="drone-cards">

            {droneList.map((drone) => {

              const battery = Number(drone.battery) || 0;

              const statusClass =
                getStatusClass(drone.status);

              const batteryClass =
                getBatteryClass(battery);

              return (
                <div
                  className="drone-card"
                  key={drone.droneId}
                >


                  <div className="drone-card-header">

                    <h3>
                      ✈ {drone.droneId}
                    </h3>

                    <span
                      className={`drone-status ${statusClass}`}
                    >
                      ● {drone.status}
                    </span>

                  </div>


                 

                  <div className="drone-details">

                    <div>
                      <small>Battery</small>

                      <strong>
                        {battery}%
                      </strong>
                    </div>


                    <div>
                      <small>Altitude</small>

                      <strong>
                        {drone.altitude || 0} m
                      </strong>
                    </div>

                  </div>


                

                  <div className="battery">

                    <div
                      className={`battery-level ${batteryClass}`}
                      style={{
                        width: `${Math.min(
                          Math.max(battery, 0),
                          100
                        )}%`,
                      }}
                    ></div>

                  </div>


                  

                  <div className="drone-location">

                    <small>Location</small>

                    {drone.latitude &&
                    drone.longitude ? (
                      <span>
                        {Number(drone.latitude).toFixed(4)},
                        {" "}
                        {Number(drone.longitude).toFixed(4)}
                      </span>
                    ) : (
                      <span>
                        Waiting for telemetry...
                      </span>
                    )}

                  </div>


               

                  <div className="drone-last-update">

                    <span>
                      📡
                    </span>

                    <span>
                      {getLastUpdate(
                        drone.lastUpdate
                      )}
                    </span>

                  </div>

                </div>
              );
            })}

          </div>

        </div>



        {lowBatteryDrones.length > 0 && (

          <div className="live-alert-panel">

            <div className="alert-panel-header">

              <div>
                <h2>⚠ Low Battery Alert</h2>

                <p>
                  Drones requiring attention
                </p>
              </div>

              <span>
                {lowBatteryDrones.length}
              </span>

            </div>


            <div className="alert-drone-list">

              {lowBatteryDrones.map((drone) => (

                <div
                  className="alert-drone"
                  key={drone.droneId}
                >

                  <strong>
                    {drone.droneId}
                  </strong>

                  <span>
                    Battery: {Number(drone.battery)}%
                  </span>

                  <span>
                    Location:{" "}
                    {Number(drone.latitude).toFixed(4)},
                    {" "}
                    {Number(drone.longitude).toFixed(4)}
                  </span>

                </div>

              ))}

            </div>

          </div>

        )}

      </div>
    </>
  );
}

export default LiveMap;