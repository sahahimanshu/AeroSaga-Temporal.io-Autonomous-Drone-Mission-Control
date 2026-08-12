import React from "react";
import CesiumMap from "../../components/CesiumMap";
import "./LiveMap.css";
import { useNavigate } from "react-router-dom";

function LiveMap() {
    const navigate = useNavigate();
  return (
    <>
 <button
className="back-button"
  onClick={() => navigate("/dashboard")}>
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
              <h3>✈ M-101 </h3>
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
              <h3>✈ M-102</h3>
              <span className="online">Online</span>
            </div>

            <div className="drone-details">
              <div>
                <small>Battery</small>
                <strong>87%</strong>
              </div>

              <div>
                <small>Mission</small>
                <strong>M-102</strong>
              </div>
            </div>

            <div className="battery">
              <div
                className="battery-level"
                style={{ width: "87%" }}
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