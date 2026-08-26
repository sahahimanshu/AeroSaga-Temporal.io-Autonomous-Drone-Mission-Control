import { useEffect, useRef } from "react";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

function CesiumMap() {
  const containerRef = useRef(null);

  useEffect(() => {
    let viewer;
    let destroyed = false;
    let socket;

    const createMap = async () => {
      if (!containerRef.current) return;

      Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5YTYzNTZmZS1lYzg4LTRhYWYtODgxOS0yOGRlYmFlMDc1MTEiLCJpZCI6NDY0NTg1LCJzdWIiOiJIaW1hbnNodSBTYWhhIiwiaXNzIjoiaHR0cHM6Ly9hcGkuY2VzaXVtLmNvbSIsImF1ZCI6IkhpbWFuc2h1IFNhaGFfZGVmYXVsdCIsImlhdCI6MTc4NjM1OTYyMn0.WAGHm35KL9RYeQhjHP9LLaqB22Ljj-Y4NkYMPy_F-Ak";

      try {
        const imageryProvider =
          await Cesium.ArcGisMapServerImageryProvider.fromUrl(
            "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
          );

        if (destroyed || !containerRef.current) return;

        viewer = new Cesium.Viewer(containerRef.current, {
          baseLayer: new Cesium.ImageryLayer(imageryProvider),

          animation: false,
          timeline: false,

          baseLayerPicker: true,
          geocoder: true,
          homeButton: true,
          sceneModePicker: true,
          navigationHelpButton: true,

          fullscreenButton: false,
          vrButton: false,

          infoBox: true,
          selectionIndicator: true,

          shouldAnimate: true,
          shadows: false,
        });

        // Initial position of M-102
        const initialPosition = Cesium.Cartesian3.fromDegrees(
          88.3639,
          22.5726,
          120
        );

        const droneEntity = viewer.entities.add({
          id: "drone-M-102",

          name: "M-102",

          description: `
            <div style="font-family: Arial;">
              <h3>Drone M-102</h3>
              <p><strong>Status:</strong> Online</p>
              <p><strong>Altitude:</strong> 120 m</p>
              <p><strong>Latitude:</strong> 22.5726</p>
              <p><strong>Longitude:</strong> 88.3639</p>
              <p><strong>Battery:</strong> 100%</p>
            </div>
          `,

          position: initialPosition,

          point: {
            pixelSize: 14,
            color: Cesium.Color.RED,
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 3,
          },

          label: {
            text: "M-102",

            font: "bold 14px Arial",

            fillColor: Cesium.Color.WHITE,

            outlineColor: Cesium.Color.BLACK,

            outlineWidth: 3,

            style: Cesium.LabelStyle.FILL_AND_OUTLINE,

            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,

            pixelOffset: new Cesium.Cartesian2(0, -18),
          },
        });

        // Camera
        viewer.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(
            88.3639,
            22.5726,
            12000
          ),

          orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-60),
            roll: 0,
          },
        });

        // WebSocket
        socket = new WebSocket("ws://localhost:8081");

        socket.onopen = () => {
          console.log("Cesium WebSocket connected");
        };

        socket.onmessage = (event) => {
          try {
            const telemetry = JSON.parse(event.data);

            console.log("Cesium telemetry:", telemetry);

            if (telemetry.droneId !== "M-102") {
              return;
            }

            const latitude = Number(telemetry.latitude);
            const longitude = Number(telemetry.longitude);
            const altitude = Number(telemetry.altitude);
            const battery = Number(telemetry.battery);

            if (
              Number.isNaN(latitude) ||
              Number.isNaN(longitude) ||
              Number.isNaN(altitude)
            ) {
              return;
            }

            // Move M-102
            droneEntity.position = Cesium.Cartesian3.fromDegrees(
              longitude,
              latitude,
              altitude
            );

            // Update information
            droneEntity.description = `
              <div style="font-family: Arial;">
                <h3>Drone M-102</h3>
                <p><strong>Status:</strong> ${telemetry.status}</p>
                <p><strong>Altitude:</strong> ${altitude} m</p>
                <p><strong>Latitude:</strong> ${latitude}</p>
                <p><strong>Longitude:</strong> ${longitude}</p>
                <p><strong>Battery:</strong> ${battery}%</p>
              </div>
            `;

            // Update label
            droneEntity.label.text = `M-102 | ${battery}%`;
          } catch (error) {
            console.error("Telemetry parsing error:", error);
          }
        };

        socket.onerror = (error) => {
          console.error("Cesium WebSocket error:", error);
        };

        socket.onclose = () => {
          console.log("Cesium WebSocket disconnected");
        };
      } catch (error) {
        console.error("Cesium map failed to initialize:", error);
      }
    };

    createMap();

    return () => {
      destroyed = true;

      if (socket) {
        socket.close();
      }

      if (viewer && !viewer.isDestroyed()) {
        viewer.destroy();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="cesium-map-container"
    />
  );
}

export default CesiumMap;