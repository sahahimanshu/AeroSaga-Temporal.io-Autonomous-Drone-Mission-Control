import React, { useState, useEffect } from "react";

import CesiumMap from "../components/CesiumMap";
import "./Dashboard.css";

function Dashboard() {
   const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

  return (
    <div className="dashboard">

      
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


      

      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-icon blue">
          <span className="drone-icon">✈</span>
          </div>

          <div className="stat-content">
            <p>Total Drones</p>
            <h2>50</h2>
            <span>All registered drones</span>
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-icon green">
            <span className="drone-icon">✈</span>
          </div>

          <div className="stat-content">
            <p>Active Drones</p>
            <h2>1</h2>
            
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-icon red">
            <span className="drone-icon">✈</span>
          </div>

          <div className="stat-content">
            <p>Offline Drones</p>
            <h2>0</h2>
            
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-icon purple">
            🚩
          </div>

          <div className="stat-content">
            <p>Active Missions</p>
            <h2>7</h2>
            <span>Currently in progress</span>
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-icon yellow">
            🔋
          </div>

          <div className="stat-content">
            <p>Avg. Battery</p>
            <h2>87%</h2>
            <span>Fleet average</span>
          </div>
        </div>

      </div>


      

      <div className="dashboard-grid">


        <section className="map-card">

          <div className="card-header">
            <div>
              <h2>Live Map</h2>
              <span>Real-time drone locations</span>
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


        

        <section className="missions-card">

          <div className="card-header">
            <div>
              <h2>Recent Missions</h2>
              <span>Latest mission activity</span>
            </div>

            <button className="view-button">
              View All
            </button>
          </div>


          <div className="mission-list">

            <div className="mission-row">

              <div className="mission-info">
                <strong>M-104</strong>
                <span>Survey Mission</span>
              </div>

              <span className="mission-status progress">
                In Progress
              </span>

            </div>


            <div className="mission-row">

              <div className="mission-info">
                <strong>M-103</strong>
                <span>Mapping Mission</span>
              </div>

              <span className="mission-status completed">
                Completed
              </span>

            </div>


            <div className="mission-row">

              <div className="mission-info">
                <strong>M-102</strong>
                <span>Inspection Mission</span>
              </div>

              <span className="mission-status completed">
                Completed
              </span>

            </div>


            <div className="mission-row">

              <div className="mission-info">
                <strong>M-101</strong>
                <span>Delivery Mission</span>
              </div>

              <span className="mission-status failed">
                Failed
              </span>

            </div>

          </div>

        </section>

      </div>


      

      <div className="lower-grid">

        

        <section className="data-card">

          <div className="card-header">
            <div>
              <h2>Drone Fleet</h2>
              <span>Current fleet status</span>
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
                  <td>AG-001</td>
                  <td>
                    <span className="table-status active">
                      ● Active
                    </span>
                  </td>
                  <td>92%</td>
                  <td>Sector A</td>
                  <td>1 min ago</td>
                </tr>


                <tr>
                  <td>AG-002</td>
                  <td>
                    <span className="table-status active">
                      ● Active
                    </span>
                  </td>
                  <td>84%</td>
                  <td>Sector B</td>
                  <td>1 min ago</td>
                </tr>


                <tr>
                  <td>AG-003</td>
                  <td>
                    <span className="table-status active">
                      ● Active
                    </span>
                  </td>
                  <td>76%</td>
                  <td>Sector C</td>
                  <td>2 min ago</td>
                </tr>


                <tr>
                  <td>AG-007</td>
                  <td>
                    <span className="table-status warning">
                      ● Low Battery
                    </span>
                  </td>
                  <td>23%</td>
                  <td>Maintenance Zone</td>
                  <td>3 min ago</td>
                </tr>


                <tr>
                  <td>AG-011</td>
                  <td>
                    <span className="table-status offline">
                      ● Offline
                    </span>
                  </td>
                  <td>0%</td>
                  <td>Hangar 02</td>
                  <td>10 min ago</td>
                </tr>

              </tbody>

            </table>

          </div>

        </section>


        

        <section className="data-card">

          <div className="card-header">

            <div>
              <h2>System Alerts</h2>
              <span>Important notifications</span>
            </div>

            <button className="view-button">
              View All
            </button>

          </div>


          <div className="alerts-list">

            <div className="alert-item danger">

              <div className="alert-icon">
                ⚠
              </div>

              <div>
                <strong>Low Battery: AG-007</strong>
                <span>Battery level critical: 23%</span>
                <small>2 min ago</small>
              </div>

            </div>


            <div className="alert-item warning">

              <div className="alert-icon">
                ⚠
              </div>

              <div>
                <strong>Mission M-104</strong>
                <span>Connection unstable at waypoint 5</span>
                <small>5 min ago</small>
              </div>

            </div>


            <div className="alert-item info">

              <div className="alert-icon">
                ℹ
              </div>

              <div>
                <strong>Maintenance Due</strong>
                <span>AG-015 maintenance in 2 days</span>
                <small>1 hour ago</small>
              </div>

            </div>


            <div className="alert-item info">

              <div className="alert-icon">
                ℹ
              </div>

              <div>
                <strong>Weather Update</strong>
                <span>Heavy rain expected in Sector B</span>
                <small>2 hours ago</small>
              </div>

            </div>

          </div>

        </section>

      </div>

    </div>
  );
}

export default Dashboard;