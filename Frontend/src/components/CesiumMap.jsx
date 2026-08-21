import { useEffect, useRef } from "react";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

function CesiumMap() {
  const containerRef = useRef(null);

  useEffect(() => {
    let viewer;
    let destroyed = false;

    const createMap = async () => {
      if (!containerRef.current) return;

      try {
        // ============================================================
        // MAP PROVIDERS
        // ============================================================

        // 1. Satellite imagery
        const satelliteProvider =
          await Cesium.ArcGisMapServerImageryProvider.fromUrl(
            "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
          );

        // 2. Street map
        const streetProvider =
          await Cesium.ArcGisMapServerImageryProvider.fromUrl(
            "https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer"
          );

        // 3. Topographic map
        const topoProvider =
          await Cesium.ArcGisMapServerImageryProvider.fromUrl(
            "https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer"
          );

        if (destroyed || !containerRef.current) return;

        // ============================================================
        // IMAGERY VIEW MODELS
        // ============================================================

        const satelliteViewModel =
          new Cesium.ProviderViewModel({
            name: "Satellite",
            iconUrl:
              "https://cesium.com/downloads/cesiumjs/releases/1.144/Build/Cesium/Widgets/Images/ImageryProviders/esriWorldImagery.png",
            tooltip: "High resolution satellite imagery",

            creationFunction: async () => {
              return satelliteProvider;
            },
          });

        const streetViewModel =
          new Cesium.ProviderViewModel({
            name: "Street Map",
            iconUrl:
              "https://cesium.com/downloads/cesiumjs/releases/1.144/Build/Cesium/Widgets/Images/ImageryProviders/esriWorldStreetMap.png",
            tooltip: "World street map",

            creationFunction: async () => {
              return streetProvider;
            },
          });

        const topoViewModel =
          new Cesium.ProviderViewModel({
            name: "Topographic",
            iconUrl:
              "https://cesium.com/downloads/cesiumjs/releases/1.144/Build/Cesium/Widgets/Images/ImageryProviders/esriWorldTopo.png",
            tooltip: "Topographic map",

            creationFunction: async () => {
              return topoProvider;
            },
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

          // View controls
          baseLayerPicker: true,
          sceneModePicker: true,

          // Navigation
          homeButton: true,
          navigationHelpButton: false,

          // Search
          geocoder: true,

          // UI
          animation: false,
          timeline: false,
          fullscreenButton: false,
          vrButton: false,

          // Drone information
          infoBox: true,
          selectionIndicator: true,

          // Rendering
          shouldAnimate: true,
          shadows: false,

          // Performance
          requestRenderMode: false,
        });

        // ============================================================
        // SCENE SETTINGS
        // ============================================================

        viewer.scene.globe.show = true;

        viewer.scene.globe.enableLighting = false;

        viewer.scene.globe.depthTestAgainstTerrain = false;

        // Better rendering quality
        viewer.scene.postProcessStages.fxaa.enabled = true;

        // ============================================================
        // DRONE DATA
        // ============================================================

        const drone = {
          id: "DR-001",
          latitude: 12.9716,
          longitude: 77.5946,
          altitude: 1000,
          status: "Active",
          battery: 87,
          speed: 42,
          mission: "Mapping Mission",
        };

        // ============================================================
        // DRONE POSITION
        // ============================================================

        const dronePosition = Cesium.Cartesian3.fromDegrees(
          drone.longitude,
          drone.latitude,
          drone.altitude
        );

        // ============================================================
        // DRONE ENTITY
        // ============================================================

        viewer.entities.add({
          id: drone.id,

          name: drone.id,

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
                <strong>Speed:</strong>
                ${drone.speed} km/h
              </p>

              <p>
                <strong>Altitude:</strong>
                ${drone.altitude} m
              </p>

              <p>
                <strong>Mission:</strong>
                ${drone.mission}
              </p>

              <hr />

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

          position: dronePosition,

          // ==========================================================
          // DRONE POINT
          // ==========================================================

          point: {
            pixelSize: 18,

            color: Cesium.Color.fromCssColorString("#00ff88"),

            outlineColor: Cesium.Color.WHITE,

            outlineWidth: 3,

            disableDepthTestDistance:
              Number.POSITIVE_INFINITY,
          },

          // ==========================================================
          // DRONE LABEL
          // ==========================================================

          label: {
            text: `${drone.id} • ${drone.status}`,

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
        });

        // ============================================================
        // DRONE GLOW CIRCLE
        // ============================================================

        viewer.entities.add({
          id: "drone-range",

          position: dronePosition,

          ellipse: {
            semiMajorAxis: 180,
            semiMinorAxis: 180,

            material:
              Cesium.Color.fromCssColorString(
                "#00ff88"
              ).withAlpha(0.10),

            outline: true,

            outlineColor:
              Cesium.Color.fromCssColorString(
                "#00ff88"
              ).withAlpha(0.55),

            outlineWidth: 2,

            height: drone.altitude,
          },
        });

        // ============================================================
        // CAMERA POSITION
        // ============================================================

        viewer.camera.setView({
          destination:
            Cesium.Cartesian3.fromDegrees(
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
        // CAMERA DOUBLE CLICK / FOCUS DRONE
        // ============================================================

        viewer.selectedEntityChanged.addEventListener(
          (entity) => {
            if (!entity) return;

            if (entity.id === drone.id) {
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

        console.log("Cesium map initialized successfully.");

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

                <h2 style="
                  margin-bottom:10px;
                ">
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