import { useEffect, useRef } from "react";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

function CesiumMap({ onTelemetry }) {
  const containerRef = useRef(null);

  useEffect(() => {
    let viewer = null;
    let socket = null;
    let destroyed = false;

    const droneEntities = new Map();

    const createMap = async () => {
      if (!containerRef.current) {
        return;
      }

      Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5YTYzNTZmZS1lYzg4LTRhYWYtODgxOS0yOGRlYmFlMDc1MTEiLCJpZCI6NDY0NTg1LCJzdWIiOiJaaW1hbnNodSBTYWhhIiwiaXNzIjoiaHR0cHM6Ly9hcGkuY2VzaXVtLmNvbSIsImF1ZCI6IkhpbWFuc2h1IFNhaGFfZGVmYXVsdCIsImlhdCI6MTc4NjM5NTYyMn0.WAGHm35KL9RYeQhjHP9LLaqB22Ljj-Y4NkYMPy_F-Ak";

      try {
        const imageryProvider =
          await Cesium.ArcGisMapServerImageryProvider.fromUrl(
            "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
          );

        if (destroyed || !containerRef.current) {
          return;
        }

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

        viewer.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(
            78.9629,
            22.5937,
            2500000
          ),

          orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-90),
            roll: 0,
          },
        });

        socket = new WebSocket("ws://localhost:8081");

        socket.onopen = () => {
          console.log("Cesium WebSocket connected");
        };

        socket.onmessage = (event) => {
          try {
            const telemetry = JSON.parse(event.data);

            console.log("Cesium telemetry:", telemetry);

            const droneId = telemetry.droneId;

            const latitude = Number(telemetry.latitude);
            const longitude = Number(telemetry.longitude);
            const altitude = Number(telemetry.altitude);
            const battery = Number(telemetry.battery);

            if (!droneId) {
              return;
            }

            if (
              Number.isNaN(latitude) ||
              Number.isNaN(longitude) ||
              Number.isNaN(altitude) ||
              Number.isNaN(battery)
            ) {
              return;
            }

           
           const liveTelemetry = {
  ...telemetry,
  droneId,
  latitude,
  longitude,
  altitude,
  battery,
};

window.dispatchEvent(
  new CustomEvent("drone-telemetry", {
    detail: liveTelemetry,
  })
);


if (onTelemetry) {
  onTelemetry(liveTelemetry);

            }

            let droneEntity = droneEntities.get(droneId);

            if (!droneEntity) {
              console.log("Creating drone:", droneId);

              droneEntity = viewer.entities.add({
                id: `drone-${droneId}`,

                name: droneId,

                position: Cesium.Cartesian3.fromDegrees(
                  longitude,
                  latitude,
                  altitude
                ),

                point: {
                  pixelSize: 10,

                  color:
                    battery <= 20
                      ? Cesium.Color.RED
                      : battery <= 50
                      ? Cesium.Color.YELLOW
                      : Cesium.Color.LIME,

                  outlineColor: Cesium.Color.WHITE,

                  outlineWidth: 2,
                },

                label: {
                  text: `${droneId} | ${battery}%`,

                  font: "bold 11px Arial",

                  fillColor: Cesium.Color.WHITE,

                  outlineColor: Cesium.Color.BLACK,

                  outlineWidth: 2,

                  style: Cesium.LabelStyle.FILL_AND_OUTLINE,

                  verticalOrigin:
                    Cesium.VerticalOrigin.BOTTOM,

                  pixelOffset:
                    new Cesium.Cartesian2(0, -14),

                  showBackground: false,

                  disableDepthTestDistance:
                    Number.POSITIVE_INFINITY,
                },

                description: "",
              });

              droneEntities.set(
                droneId,
                droneEntity
              );

              console.log(
                "Total drones:",
                droneEntities.size
              );
            }

            droneEntity.position =
              Cesium.Cartesian3.fromDegrees(
                longitude,
                latitude,
                altitude
              );

            droneEntity.label.text =
              `${droneId} | ${battery}%`;

            
            if (battery <= 20) {
              droneEntity.point.color =
                Cesium.Color.RED;
            } else if (battery <= 50) {
              droneEntity.point.color =
                Cesium.Color.YELLOW;
            } else {
              droneEntity.point.color =
                Cesium.Color.LIME;
            }

            droneEntity.description = `
              <div style="font-family: Arial; padding: 8px;">
                <h3>Drone ${droneId}</h3>

                <p>
                  <strong>Status:</strong>
                  ${telemetry.status ?? "Unknown"}
                </p>

                <p>
                  <strong>Battery:</strong>
                  ${battery}%
                </p>

                <p>
                  <strong>Speed:</strong>
                  ${telemetry.speed ?? "N/A"} km/h
                </p>

                <p>
                  <strong>Altitude:</strong>
                  ${altitude} m
                </p>

                <p>
                  <strong>Latitude:</strong>
                  ${latitude}
                </p>

                <p>
                  <strong>Longitude:</strong>
                  ${longitude}
                </p>

                <p>
                  <strong>Signal:</strong>
                  ${telemetry.signal ?? "N/A"}
                </p>
              </div>
            `;
          } catch (error) {
            console.error(
              "Telemetry parsing error:",
              error
            );
          }
        };

        socket.onerror = (error) => {
          console.error(
            "Cesium WebSocket error:",
            error
          );
        };

        socket.onclose = () => {
          console.log(
            "Cesium WebSocket disconnected"
          );
        };
      } catch (error) {
        console.error(
          "Cesium map failed to initialize:",
          error
        );
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

      droneEntities.clear();
    };
  }, [onTelemetry]);

  return (
    <div
      ref={containerRef}
      className="cesium-map-container"
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
}

export default CesiumMap;