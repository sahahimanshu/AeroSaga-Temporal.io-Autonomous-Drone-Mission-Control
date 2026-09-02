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
        // MULTI DRONE STORAGE
        // ============================================================

        const drones = new Map();

        // ============================================================
        // DRONE COLOR
        // ============================================================

        const getDroneColor = (status) => {
          const normalizedStatus = String(status || "").toLowerCase();

          if (
            normalizedStatus === "offline" ||
            normalizedStatus === "disconnected"
          ) {
            return Cesium.Color.RED;
          }

          if (
            normalizedStatus === "warning" ||
            normalizedStatus === "low-battery"
          ) {
            return Cesium.Color.YELLOW;
          }

          if (
            normalizedStatus === "online" ||
            normalizedStatus === "active"
          ) {
            return Cesium.Color.fromCssColorString("#00ff88");
          }

          return Cesium.Color.YELLOW;
        };

        // ============================================================
        // DRONE DESCRIPTION
        // ============================================================

        const createDroneDescription = (
          droneId,
          status,
          battery,
          altitude,
          latitude,
          longitude
        ) => {
          return `
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
                ${Number(latitude).toFixed(6)}
              </p>

              <p>
                <strong>Longitude:</strong>
                ${Number(longitude).toFixed(6)}
              </p>

            </div>
          `;
        };

        // ============================================================
        // CREATE DRONE
        // ============================================================

        const createDrone = (telemetry) => {
          const droneId = telemetry.droneId;

          const latitude = Number(telemetry.latitude);
          const longitude = Number(telemetry.longitude);
          const altitude = Number(telemetry.altitude) || 0;
          const battery = Number(telemetry.battery) || 0;
          const status = telemetry.status || "Unknown";

          const position = Cesium.Cartesian3.fromDegrees(
            longitude,
            latitude,
            altitude
          );

          // ==========================================================
          // DRONE ENTITY
          // ==========================================================

          const droneEntity = viewer.entities.add({
            id: `drone-${droneId}`,

            name: droneId,

            position,

            point: {
              pixelSize: 18,

              color: getDroneColor(status),

              outlineColor: Cesium.Color.WHITE,

              outlineWidth: 3,

              disableDepthTestDistance:
                Number.POSITIVE_INFINITY,
            },

            label: {
              text: `${droneId} • ${status}`,

              font: "bold 14px Arial",

              fillColor: Cesium.Color.WHITE,

              outlineColor: Cesium.Color.BLACK,

              outlineWidth: 4,

              style: Cesium.LabelStyle.FILL_AND_OUTLINE,

              verticalOrigin:
                Cesium.VerticalOrigin.BOTTOM,

              horizontalOrigin:
                Cesium.HorizontalOrigin.CENTER,

              pixelOffset:
                new Cesium.Cartesian2(0, -24),

              disableDepthTestDistance:
                Number.POSITIVE_INFINITY,
            },

            description: createDroneDescription(
              droneId,
              status,
              battery,
              altitude,
              latitude,
              longitude
            ),
          });

          // ==========================================================
          // RANGE CIRCLE
          // ==========================================================

          const rangeEntity = viewer.entities.add({
            id: `drone-range-${droneId}`,

            position:
              Cesium.Cartesian3.fromDegrees(
                longitude,
                latitude,
                0
              ),

            ellipse: {
              semiMajorAxis: 180,

              semiMinorAxis: 180,

              material:
                Cesium.Color.fromCssColorString(
                  "#00ff88"
                ).withAlpha(0.08),

              outline: true,

              outlineColor:
                Cesium.Color.fromCssColorString(
                  "#00ff88"
                ).withAlpha(0.45),

              outlineWidth: 2,

              height: 0,
            },
          });

          const droneData = {
            id: droneId,

            latitude,

            longitude,

            altitude,

            battery,

            status,

            entity: droneEntity,

            rangeEntity,
          };

          drones.set(droneId, droneData);

          return droneData;
        };

        // ============================================================
        // UPDATE DRONE
        // ============================================================

        const updateDrone = (droneData, telemetry) => {
          const droneId = telemetry.droneId;

          const latitude = Number(telemetry.latitude);
          const longitude = Number(telemetry.longitude);
          const altitude = Number(telemetry.altitude) || 0;
          const battery = Number(telemetry.battery) || 0;
          const status = telemetry.status || "Unknown";

          droneData.latitude = latitude;
          droneData.longitude = longitude;
          droneData.altitude = altitude;
          droneData.battery = battery;
          droneData.status = status;

          // ==========================================================
          // NEW POSITION
          // ==========================================================

          const newPosition =
            Cesium.Cartesian3.fromDegrees(
              longitude,
              latitude,
              altitude
            );

          // ==========================================================
          // MOVE DRONE
          // ==========================================================

          droneData.entity.position = newPosition;

          // ==========================================================
          // MOVE RANGE CIRCLE
          // ==========================================================

          droneData.rangeEntity.position =
            Cesium.Cartesian3.fromDegrees(
              longitude,
              latitude,
              0
            );

          // ==========================================================
          // UPDATE NAME
          // ==========================================================

          droneData.entity.name = droneId;

          // ==========================================================
          // UPDATE LABEL
          // ==========================================================

          droneData.entity.label.text =
            `${droneId} • ${status}`;

          // ==========================================================
          // UPDATE DESCRIPTION
          // ==========================================================

          droneData.entity.description =
            createDroneDescription(
              droneId,
              status,
              battery,
              altitude,
              latitude,
              longitude
            );

          // ==========================================================
          // UPDATE COLOR
          // ==========================================================

          droneData.entity.point.color =
            getDroneColor(status);

          // ==========================================================
          // BATTERY WARNING
          // ==========================================================

          if (battery <= 20) {
            droneData.rangeEntity.ellipse.outlineColor =
              Cesium.Color.RED.withAlpha(0.7);

            droneData.rangeEntity.ellipse.material =
              Cesium.Color.RED.withAlpha(0.12);
          } else {
            droneData.rangeEntity.ellipse.outlineColor =
              Cesium.Color.fromCssColorString(
                "#00ff88"
              ).withAlpha(0.45);

            droneData.rangeEntity.ellipse.material =
              Cesium.Color.fromCssColorString(
                "#00ff88"
              ).withAlpha(0.08);
          }
        };

        // ============================================================
        // INITIAL CAMERA
        // ============================================================

        viewer.camera.setView({
          destination:
            Cesium.Cartesian3.fromDegrees(
              88.3639,
              22.5726,
              25000
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

        socket =
          new WebSocket("ws://localhost:8090");

        socket.onopen = () => {
          console.log(
            "Telemetry WebSocket connected on port 8090."
          );
        };

        // ============================================================
        // TELEMETRY MESSAGE
        // ============================================================

        socket.onmessage = (event) => {
          try {
            const telemetry =
              JSON.parse(event.data);

            console.log(
              "Telemetry received:",
              telemetry
            );

            // ========================================================
            // VALIDATE
            // ========================================================

            if (
              !telemetry.droneId ||
              typeof telemetry.latitude !==
                "number" ||
              typeof telemetry.longitude !==
                "number"
            ) {
              console.warn(
                "Invalid telemetry:",
                telemetry
              );

              return;
            }

            const droneId =
              telemetry.droneId;

            // ========================================================
            // FIND DRONE
            // ========================================================

            let droneData =
              drones.get(droneId);

            // ========================================================
            // CREATE OR UPDATE
            // ========================================================

            if (!droneData) {
              droneData =
                createDrone(telemetry);

              console.log(
                `New drone added: ${droneId}`
              );
            } else {
              updateDrone(
                droneData,
                telemetry
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

        viewer.homeButton.viewModel.command
          .beforeExecute
          .addEventListener((event) => {
            event.cancel = true;

            viewer.camera.flyTo({
              destination:
                Cesium.Cartesian3.fromDegrees(
                  88.3639,
                  22.5726,
                  25000
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

            if (
              typeof entity.id === "string" &&
              entity.id.startsWith("drone-")
            ) {
              const droneId =
                entity.id.replace(
                  "drone-",
                  ""
                );

              const droneData =
                drones.get(droneId);

              if (!droneData) return;

              viewer.camera.flyTo({
                destination:
                  Cesium.Cartesian3.fromDegrees(
                    droneData.longitude,
                    droneData.latitude,
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

      if (
        viewer &&
        !viewer.isDestroyed()
      ) {
        viewer.destroy();
      }
    };
  }, []);

  // ================================================================
  // MAP CONTAINER
  // ================================================================

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