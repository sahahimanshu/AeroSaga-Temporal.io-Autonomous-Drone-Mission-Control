import { useEffect, useRef } from "react";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

function CesiumMap() {
  const containerRef = useRef(null);

  useEffect(() => {
    let viewer;
    let socket;
    let destroyed = false;

    const createMap = async () => {
      if (!containerRef.current) return;

      try {
        // ============================================================
        // MAP PROVIDERS
        // ============================================================

        const satelliteProvider =
          await Cesium.ArcGisMapServerImageryProvider.fromUrl(
            "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
          );

        const streetProvider =
          await Cesium.ArcGisMapServerImageryProvider.fromUrl(
            "https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer"
          );

        const topoProvider =
          await Cesium.ArcGisMapServerImageryProvider.fromUrl(
            "https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer"
          );

        if (destroyed || !containerRef.current) return;

        // ============================================================
        // IMAGERY VIEW MODELS
        // ============================================================

        const satelliteViewModel = new Cesium.ProviderViewModel({
          name: "Satellite",
          iconUrl:
            "https://cesium.com/downloads/cesiumjs/releases/1.144/Build/Cesium/Widgets/Images/ImageryProviders/esriWorldImagery.png",
          tooltip: "High resolution satellite imagery",
          creationFunction: async () => satelliteProvider,
        });

        const streetViewModel = new Cesium.ProviderViewModel({
          name: "Street Map",
          iconUrl:
            "https://cesium.com/downloads/cesiumjs/releases/1.144/Build/Cesium/Widgets/Images/ImageryProviders/esriWorldStreetMap.png",
          tooltip: "World street map",
          creationFunction: async () => streetProvider,
        });

        const topoViewModel = new Cesium.ProviderViewModel({
          name: "Topographic",
          iconUrl:
            "https://cesium.com/downloads/cesiumjs/releases/1.144/Build/Cesium/Widgets/Images/ImageryProviders/esriWorldTopo.png",
          tooltip: "Topographic map",
          creationFunction: async () => topoProvider,
        });

        // ============================================================
        // CESIUM VIEWER
        // ============================================================

        viewer = new Cesium.Viewer(containerRef.current, {
          baseLayer: new Cesium.ImageryLayer(satelliteProvider),

          imageryProviderViewModels: [
            satelliteViewModel,
            streetViewModel,
            topoViewModel,
          ],

          selectedImageryProviderViewModel: satelliteViewModel,

          baseLayerPicker: true,
          sceneModePicker: true,

          homeButton: true,
          navigationHelpButton: false,

          geocoder: true,

          animation: false,
          timeline: false,

          fullscreenButton: false,
          vrButton: false,

          infoBox: true,
          selectionIndicator: true,

          shouldAnimate: true,
          shadows: false,

          requestRenderMode: false,
        });

        // ============================================================
        // SCENE SETTINGS
        // ============================================================

        viewer.scene.globe.show = true;
        viewer.scene.globe.enableLighting = false;
        viewer.scene.globe.depthTestAgainstTerrain = false;

        viewer.scene.postProcessStages.fxaa.enabled = true;

        // ============================================================
        // DRONE DATA
        // ============================================================

        const drone = {
          id: "M-102",
          latitude: 22.5726,
          longitude: 88.3639,
          altitude: 120,
          status: "Connecting",
          battery: 100,
          hasReceivedTelemetry: false,
        };

        // ============================================================
        // DRONE ENTITY
        // ============================================================

        const droneEntity = viewer.entities.add({
          id: "drone-M-102",

          name: drone.id,

          position: Cesium.Cartesian3.fromDegrees(
            drone.longitude,
            drone.latitude,
            drone.altitude
          ),

          point: {
            pixelSize: 24,

            color: Cesium.Color.fromCssColorString("#00ff88"),

            outlineColor: Cesium.Color.WHITE,

            outlineWidth: 4,

            disableDepthTestDistance:
              Number.POSITIVE_INFINITY,
          },

          label: {
            text: `${drone.id} • ${drone.status}`,

            font: "bold 15px Arial",

            fillColor: Cesium.Color.WHITE,

            outlineColor: Cesium.Color.BLACK,

            outlineWidth: 4,

            style: Cesium.LabelStyle.FILL_AND_OUTLINE,

            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,

            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,

            pixelOffset: new Cesium.Cartesian2(0, -28),

            disableDepthTestDistance:
              Number.POSITIVE_INFINITY,
          },

          description: `
            <div style="
              font-family: Arial, sans-serif;
              padding: 8px;
              min-width: 220px;
            ">

              <h2 style="
                margin: 0 0 12px 0;
                color: #1e88ff;
              ">
                ${drone.id}
              </h2>

              <p>
                <strong>Status:</strong>
                ${drone.status}
              </p>

              <p>
                <strong>Battery:</strong>
                ${drone.battery}%
              </p>

              <p>
                <strong>Altitude:</strong>
                ${drone.altitude} m
              </p>

              <p>
                <strong>Latitude:</strong>
                ${drone.latitude}
              </p>

              <p>
                <strong>Longitude:</strong>
                ${drone.longitude}
              </p>

            </div>
          `,
        });

        // ============================================================
        // DRONE RANGE CIRCLE
        // ============================================================

        const rangeEntity = viewer.entities.add({
          id: "drone-range-M-102",

          position: Cesium.Cartesian3.fromDegrees(
            drone.longitude,
            drone.latitude,
            0
          ),

          ellipse: {
            semiMajorAxis: 180,
            semiMinorAxis: 180,

            material: Cesium.Color.fromCssColorString(
              "#00ff88"
            ).withAlpha(0.10),

            outline: true,

            outlineColor: Cesium.Color.fromCssColorString(
              "#00ff88"
            ).withAlpha(0.55),

            outlineWidth: 2,

            height: 0,
          },
        });

        // ============================================================
        // INITIAL CAMERA
        // ============================================================

        viewer.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(
            drone.longitude,
            drone.latitude,
            3500
          ),

          orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-90),
            roll: 0,
          },
        });

        // ============================================================
        // CAMERA CONTROLS
        // ============================================================

        const controller =
          viewer.scene.screenSpaceCameraController;

        controller.enableRotate = true;
        controller.enableZoom = true;
        controller.enableTranslate = true;
        controller.enableTilt = true;
        controller.enableLook = true;

        // ============================================================
        // WEBSOCKET CONNECTION
        // ============================================================

        socket = new WebSocket("ws://localhost:8081");

        socket.onopen = () => {
          console.log("Telemetry WebSocket connected.");

          drone.status = "Online";

          droneEntity.label.text =
            `${drone.id} • Online`;
        };

        socket.onmessage = (event) => {
          try {
            const telemetry = JSON.parse(event.data);

            console.log(
              "Telemetry received:",
              telemetry
            );

            // ========================================================
            // VALIDATE TELEMETRY
            // ========================================================

            if (
              typeof telemetry.latitude !== "number" ||
              typeof telemetry.longitude !== "number"
            ) {
              console.warn(
                "Invalid telemetry coordinates:",
                telemetry
              );

              return;
            }

            // ========================================================
            // GET TELEMETRY VALUES
            // ========================================================

            const droneId =
              telemetry.droneId || "M-102";

            const latitude =
              telemetry.latitude;

            const longitude =
              telemetry.longitude;

            const altitude =
              Number(telemetry.altitude) || 0;

            const battery =
              Number(telemetry.battery) || 0;

            const status =
              telemetry.status || "Unknown";

            // ========================================================
            // UPDATE LOCAL DRONE DATA
            // ========================================================

            drone.id = droneId;
            drone.latitude = latitude;
            drone.longitude = longitude;
            drone.altitude = altitude;
            drone.battery = battery;
            drone.status = status;

            // ========================================================
            // CREATE NEW CESIUM POSITION
            // ========================================================

            const newPosition =
              Cesium.Cartesian3.fromDegrees(
                longitude,
                latitude,
                altitude
              );

            // ========================================================
            // MOVE DRONE
            // ========================================================

            droneEntity.position =
              newPosition;

            // ========================================================
            // MOVE RANGE CIRCLE
            // ========================================================

            rangeEntity.position =
              Cesium.Cartesian3.fromDegrees(
                longitude,
                latitude,
                0
              );

            // ========================================================
            // UPDATE LABEL
            // ========================================================

            droneEntity.name =
              droneId;

            droneEntity.label.text =
              `${droneId} • ${status}`;

            // ========================================================
            // UPDATE DESCRIPTION
            // ========================================================

            droneEntity.description = `
              <div style="
                font-family: Arial, sans-serif;
                padding: 8px;
                min-width: 220px;
              ">

                <h2 style="
                  margin: 0 0 12px 0;
                  color: #1e88ff;
                ">
                  ${droneId}
                </h2>

                <p>
                  <strong>Status:</strong>
                  ${status}
                </p>

                <p>
                  <strong>Battery:</strong>
                  ${battery}%
                </p>

                <p>
                  <strong>Altitude:</strong>
                  ${altitude} m
                </p>

                <p>
                  <strong>Latitude:</strong>
                  ${latitude.toFixed(6)}
                </p>

                <p>
                  <strong>Longitude:</strong>
                  ${longitude.toFixed(6)}
                </p>

              </div>
            `;

            // ========================================================
            // DRONE COLOR
            // ========================================================

            if (
              status.toLowerCase() === "online" ||
              status.toLowerCase() === "active"
            ) {
              droneEntity.point.color =
                Cesium.Color.fromCssColorString(
                  "#00ff88"
                );
            } else {
              droneEntity.point.color =
                Cesium.Color.YELLOW;
            }

            // ========================================================
            // BATTERY WARNING
            // ========================================================

            if (battery <= 20) {
              rangeEntity.ellipse.outlineColor =
                Cesium.Color.RED.withAlpha(0.7);

              rangeEntity.ellipse.material =
                Cesium.Color.RED.withAlpha(0.12);
            } else {
              rangeEntity.ellipse.outlineColor =
                Cesium.Color.fromCssColorString(
                  "#00ff88"
                ).withAlpha(0.55);

              rangeEntity.ellipse.material =
                Cesium.Color.fromCssColorString(
                  "#00ff88"
                ).withAlpha(0.10);
            }

            // ========================================================
            // FIRST LIVE TELEMETRY -> FOCUS CAMERA
            // ========================================================

            if (!drone.hasReceivedTelemetry) {
              drone.hasReceivedTelemetry = true;

              viewer.camera.flyTo({
                destination:
                  Cesium.Cartesian3.fromDegrees(
                    longitude,
                    latitude,
                    3500
                  ),

                orientation: {
                  heading:
                    Cesium.Math.toRadians(0),

                  pitch:
                    Cesium.Math.toRadians(-90),

                  roll: 0,
                },

                duration: 1.5,
              });

              console.log(
                "Camera focused on live drone location."
              );
            }
          } catch (error) {
            console.error(
              "Invalid telemetry message:",
              error
            );
          }
        };

        // ============================================================
        // WEBSOCKET ERROR
        // ============================================================

        socket.onerror = (error) => {
          console.error(
            "Telemetry WebSocket error:",
            error
          );
        };

        // ============================================================
        // WEBSOCKET CLOSE
        // ============================================================

        socket.onclose = () => {
          console.log(
            "Telemetry WebSocket disconnected."
          );
        };

        // ============================================================
        // HOME BUTTON
        // ============================================================

        viewer.homeButton.viewModel.command.beforeExecute
          .addEventListener((event) => {
            event.cancel = true;

            viewer.camera.flyTo({
              destination:
                Cesium.Cartesian3.fromDegrees(
                  drone.longitude,
                  drone.latitude,
                  3500
                ),

              orientation: {
                heading:
                  Cesium.Math.toRadians(0),

                pitch:
                  Cesium.Math.toRadians(-90),

                roll: 0,
              },

              duration: 1.5,
            });
          });

        // ============================================================
        // SELECT DRONE
        // ============================================================

        viewer.selectedEntityChanged.addEventListener(
          (entity) => {
            if (!entity) return;

            if (entity.id === "drone-M-102") {
              viewer.camera.flyTo({
                destination:
                  Cesium.Cartesian3.fromDegrees(
                    drone.longitude,
                    drone.latitude,
                    1800
                  ),

                orientation: {
                  heading:
                    Cesium.Math.toRadians(0),

                  pitch:
                    Cesium.Math.toRadians(-70),

                  roll: 0,
                },

                duration: 1.2,
              });
            }
          }
        );

        console.log(
          "Cesium map initialized successfully."
        );
      } catch (error) {
        console.error(
          "Cesium map failed to initialize:",
          error
        );

        if (containerRef.current) {
          containerRef.current.innerHTML = `
            <div style="
              width:100%;
              height:100%;
              display:flex;
              align-items:center;
              justify-content:center;
              background:#071522;
              color:white;
              font-family:Arial,sans-serif;
              text-align:center;
              padding:30px;
              box-sizing:border-box;
            ">

              <div>

                <h2 style="margin-bottom:10px;">
                  Map unavailable
                </h2>

                <p style="
                  color:#9fb3c8;
                  margin:0;
                ">
                  Unable to load Cesium map imagery.
                </p>

              </div>

            </div>
          `;
        }
      }
    };

    createMap();

    // ================================================================
    // CLEANUP
    // ================================================================

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
      style={{
        width: "100%",
        height: "100%",
        minHeight: "500px",
        overflow: "hidden",
      }}
    />
  );
}

export default CesiumMap;