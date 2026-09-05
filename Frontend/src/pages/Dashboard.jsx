import React, { useEffect, useMemo, useState } from "react";
import CesiumMap from "../components/CesiumMap";
import "./Dashboard.css";

const TOTAL_DRONES = 50;
const TELEMETRY_TIMEOUT = 5000;
const createInitialDrones = () => {
  return Array.from({ length: TOTAL_DRONES }, (_, index) => {
    const id = `M-${String(index + 1).padStart(2, "0")}`;

    const battery = Math.max(
      50,
      95 - ((index * 7) % 30)
    );

    return {
      id,
      status: "OFFLINE",
      battery,
      location: `Sector ${String.fromCharCode(65 + (index % 5))}`,
      mission: "-",
      latitude: null,
      longitude: null,
      altitude: 0,
      lastUpdateMs: 0,
    };
  });
};
function Dashboard() {
  const [drones, setDrones] = useState(createInitialDrones);

  const [currentDateTime, setCurrentDateTime] =
    useState(new Date());

  const [socketStatus, setSocketStatus] =
    useState("CONNECTING");
    
    useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
       setDrones((previousDrones) => {
        const now = Date.now();

        return previousDrones.map((drone) => {
          if (!drone.lastUpdateMs) {
            return drone;
          }

          const difference =
            now - drone.lastUpdateMs;

          if (difference > TELEMETRY_TIMEOUT) {
            return {
              ...drone,
              status: "OFFLINE",
            };
          }

          return drone;
        });
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);
   useEffect(() => {
    let socket = null;
    let reconnectTimer = null;
    let destroyed = false;

    const connect = () => {
      if (destroyed) return;

      console.log(
        "Connecting to telemetry server..."
      );

      socket = new WebSocket(
        "ws://localhost:8081"
      );

      
      socket.onopen = () => {
        console.log(
          "Dashboard WebSocket connected"
        );

        setSocketStatus("LIVE");
      };

     

      socket.onmessage = (event) => {
        try {
          const raw = JSON.parse(event.data);

          console.log(
            "Dashboard telemetry:",
            raw
          );

          const rawId =
            raw.droneId ??
            raw.id;

          if (!rawId) return;

         

          const match =
            String(rawId).match(/(\d+)/);

          if (!match) return;

          const droneNumber =
            Number(match[1]);

          if (
            droneNumber < 1 ||
            droneNumber > TOTAL_DRONES
          ) {
            return;
          }

          
          const id =
            `M-${String(droneNumber).padStart(
              2,
              "0"
            )}`;

         

          const latitude = Number(
            raw.latitude ??
            raw.lat
          );

          const longitude = Number(
            raw.longitude ??
            raw.longitude ??
            raw.lon ??
            raw.lng
          );

          const altitude = Number(
            raw.altitude ??
            raw.alt ??
            0
          );

          const battery = Number(
            raw.battery
          );

          

          const safeBattery =
            Number.isNaN(battery)
              ? null
              : Math.max(
                  0,
                  Math.min(
                    100,
                    Math.round(battery)
                  )
                );

          

          const location =
            raw.location ??
            raw.sector ??
            `Sector ${String.fromCharCode(
              65 + ((droneNumber - 1) % 5)
            )}`;

         const mission = "-";

       

          setDrones((previousDrones) => {
            return previousDrones.map(
              (drone) => {
                if (drone.id !== id) {
                  return drone;
                }

                return {
                  ...drone,

                  id,

                  status: "ACTIVE",

                  battery:
                    safeBattery ??
                    drone.battery,

                  location,

                  mission,

                  latitude:
                    !Number.isNaN(latitude)
                      ? latitude
                      : drone.latitude,

                  longitude:
                    !Number.isNaN(longitude)
                      ? longitude
                      : drone.longitude,

                  altitude:
                    !Number.isNaN(altitude)
                      ? altitude
                      : drone.altitude,

                  lastUpdateMs:
                    Date.now(),
                };
              }
            );
          });

        } catch (error) {
          console.error(
            "Telemetry parsing error:",
            error
          );
        }
      };

       socket.onerror = (error) => {
        console.error(
          "Dashboard WebSocket error:",
          error
        );

        setSocketStatus("OFFLINE");
      };

     
      socket.onclose = () => {
        console.log(
          "Dashboard WebSocket disconnected"
        );

        setSocketStatus("OFFLINE");

        if (!destroyed) {
          reconnectTimer =
            setTimeout(
              connect,
              3000
            );
        }
      };
    };

    connect();

    return () => {
      destroyed = true;

      clearTimeout(reconnectTimer);

      if (socket) {
        socket.close();
      }
    };
  }, []);

  const activeDrones = useMemo(() => {
    return drones.filter(
      (drone) =>
        drone.status === "ACTIVE"
    ).length;
  }, [drones]);

  const offlineDrones = useMemo(() => {
    return drones.filter(
      (drone) =>
        drone.status === "OFFLINE"
    );
  }, [drones]);

  const lowBatteryDrones = useMemo(() => {
    return drones.filter(
      (drone) =>
        Number(drone.battery) <= 20 &&
        drone.status !== "OFFLINE"
    );
  }, [drones]);

  const averageBattery = useMemo(() => {
    if (!drones.length) return 0;

    const total = drones.reduce(
      (sum, drone) =>
        sum + Number(drone.battery || 0),
      0
    );

    return Math.round(
      total / drones.length
    );
  }, [drones]);

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

  

  const getLastUpdate = (drone) => {
    if (!drone.lastUpdateMs) {
      return "Waiting...";
    }

    const seconds = Math.floor(
      (Date.now() -
        drone.lastUpdateMs) /
        1000
    );

    if (seconds <= 0) {
      return "Just now";
    }

    if (seconds === 1) {
      return "1 sec ago";
    }

    return `${seconds} sec ago`;
  };



  return (
    <div className="dashboard">

  
      <div className="dashboard-topbar">

        <div>
          <h1>Dashboard</h1>

          <p>
            Drone Mission Control
          </p>
        </div>

        <div className="dashboard-date">

          <span
            style={{
              color:
                socketStatus === "LIVE"
                  ? "#00e676"
                  : "#ff3b3b",
            }}
          >
            ●
          </span>

          {date}

          <small>
            {time}
          </small>

        </div>

      </div>


      <div className="stats-grid">

        

        <div className="stat-card">

          <div className="stat-icon blue">
            <span className="drone-icon">
              ✈
            </span>
          </div>

          <div className="stat-content">

            <p>Total Drones</p>

            <h2>
              {TOTAL_DRONES}
            </h2>

            <span>
              All registered drones
            </span>

          </div>

        </div>

        

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
              Live telemetry
            </span>

          </div>

        </div>

    

        <div className="stat-card">

          <div className="stat-icon red">
            <span className="drone-icon">
              ✈
            </span>
          </div>

          <div className="stat-content">

            <p>Offline Drones</p>

            <h2>
              {offlineDrones.length}
            </h2>

            <span>
              No telemetry
            </span>

          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon purple">
            🚩
          </div>

          <div className="stat-content">

            <p>Active Missions</p>

            <h2>7</h2>

            <span>
              Currently in progress
            </span>

          </div>

        </div>

    

        <div className="stat-card">

          <div className="stat-icon yellow">
            🔋
          </div>

          <div className="stat-content">

            <p>Avg. Battery</p>

            <h2>
              {averageBattery}%
            </h2>

            <span>
              Fleet average
            </span>

          </div>

        </div>

      </div>

      

      <div className="dashboard-grid">

        <section className="map-card">

          <div className="card-header">

            <div>

              <h2>
                Live Map
              </h2>

              <span>
                Real-time drone locations • 50 drones
              </span>

            </div>

            <div className="live-indicator">

              <span
                style={{
                  background:
                    socketStatus ===
                    "LIVE"
                      ? "#00ff9d"
                      : "#ff3b3b",
                }}
              />

              {socketStatus}

            </div>

          </div>

          <div className="map-wrapper">

            <CesiumMap
              drones={drones}
            />

          </div>

        </section>

      </div>

      

      <div className="lower-grid">

        <section className="data-card">

          <div className="card-header">

            <div>

              <h2>
                Drone Fleet
              </h2>

              <span>
                Live status of all 50 drones
              </span>

            </div>

            <div
              style={{
                color: "#00ff9d",
                fontSize: "14px",
              }}
            >
              ● {activeDrones} Active
            </div>

          </div>

          <div
            className="table-container"
            style={{
              maxHeight: "550px",
              overflowY: "auto",
            }}
          >

            <table>

              <thead>

                <tr>

                  <th>
                    Drone ID
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Battery
                  </th>

                  <th>
                    Location
                  </th>

                  <th>
                    Last Update
                  </th>

                </tr>

              </thead>

              <tbody>

                {drones.map(
                  (drone) => (

                    <tr
                      key={drone.id}
                    >

                    

                      <td>
                        <strong>
                          {drone.id}
                        </strong>
                      </td>

                      

                      <td>

                        <span
                          className={
                            `table-status ${
                              drone.status ===
                              "ACTIVE"
                                ? "active"
                                : "offline"
                            }`
                          }
                        >

                          ●{" "}

                          {drone.status}

                        </span>

                      </td>

                     

                      <td>

                        <div
                          style={{
                            display:
                              "flex",

                            alignItems:
                              "center",

                            gap: "8px",
                          }}
                        >

                          <span>
                            {drone.battery}%
                          </span>

                          <div
                            style={{
                              width:
                                "52px",

                              height:
                                "7px",

                              background:
                                "#263746",

                              borderRadius:
                                "5px",

                              overflow:
                                "hidden",
                            }}
                          >

                            <div
                              style={{
                                width:
                                  `${Math.max(
                                    0,
                                    Math.min(
                                      100,
                                      drone.battery
                                    )
                                  )}%`,

                                height:
                                  "100%",

                                background:
                                  drone.battery <=
                                  20
                                    ? "#ff3b3b"
                                    : drone.battery <=
                                      50
                                    ? "#ffd21f"
                                    : "#00e676",

                                borderRadius:
                                  "5px",

                                transition:
                                  "width 0.3s",
                              }}
                            />

                          </div>

                        </div>

                      </td>

                     

                      <td>

                        {drone.latitude !==
                          null &&
                        drone.longitude !==
                          null
                          ? `${Number(
                              drone.latitude
                            ).toFixed(
                              4
                            )}, ${Number(
                              drone.longitude
                            ).toFixed(
                              4
                            )}`
                          : drone.location}

                      </td>


                      <td>
                        {getLastUpdate(drone)}
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        </section>


        <section className="data-card">

          <div className="card-header">

            <div>

              <h2>
                System Alerts
              </h2>

              <span>
                Important notifications
              </span>

            </div>

            <button className="view-button">
              View All
            </button>

          </div>

          <div className="alerts-list">

          

            {lowBatteryDrones.length > 0 && (

              <div className="alert-item danger">

                <div className="alert-icon">
                  ⚠
                </div>

                <div>

                  <strong>
                    Low Battery:{" "}
                    {lowBatteryDrones.length}{" "}
                    Drone
                    {lowBatteryDrones.length > 1
                      ? "s"
                      : ""}
                  </strong>

                  <span>
                    {lowBatteryDrones
                      .map(
                        (drone) =>
                          `${drone.id} (${drone.battery}%)`
                      )
                      .join(", ")}
                  </span>

                  <small>
                    Live monitoring
                  </small>

                </div>

              </div>

            )}

            

            {offlineDrones.length > 0 && (

              <div className="alert-item danger">

                <div className="alert-icon">
                  ⚠
                </div>

                <div>

                  <strong>
                    Offline Drones:{" "}
                    {offlineDrones.length}
                  </strong>

                  <span>
                    {offlineDrones
                      .map(
                        (drone) =>
                          drone.id
                      )
                      .join(", ")}
                  </span>

                  <small>
                    Check telemetry connection
                  </small>

                </div>

              </div>

            )}


            <div className="alert-item info">

              <div className="alert-icon">
                ℹ
              </div>

              <div>

                <strong>
                  Weather Update
                </strong>

                <span>
                  Heavy rain expected in Sector B
                </span>

                <small>
                  Live system monitoring
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