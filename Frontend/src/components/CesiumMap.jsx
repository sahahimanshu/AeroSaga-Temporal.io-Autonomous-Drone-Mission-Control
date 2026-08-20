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
      Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5YTYzNTZmZS1lYzg4LTRhYWYtODgxOS0yOGRlYmFlMDc1MTEiLCJpZCI6NDY0NTg1LCJzdWIiOiJIaW1hbnNodSBTYWhhIiwiaXNzIjoiaHR0cHM6Ly9hcGkuY2VzaXVtLmNvbSIsImF1ZCI6IkhpbWFuc2h1IFNhaGFfZGVmYXVsdCIsImlhdCI6MTc4NjM1OTYyMn0.WAGHm35KL9RYeQhjHP9LLaqB22Ljj-Y4NkYMPy_F-Ak";

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

        
        const dronePosition = Cesium.Cartesian3.fromDegrees(
          77.5946,
          12.9716,
          1000
        );

        viewer.entities.add({
          id: "drone-1",

          name: "Drone 1",

          description: `
            <div style="font-family: Arial;">
              <h3>Drone 1</h3>
              <p><strong>Status:</strong> Active</p>
              <p><strong>Altitude:</strong> 1000 m</p>
              <p><strong>Latitude:</strong> 12.9716</p>
              <p><strong>Longitude:</strong> 77.5946</p>
            </div>
          `,

          position: dronePosition,

          point: {
            pixelSize: 14,

            color: Cesium.Color.RED,

            outlineColor: Cesium.Color.WHITE,

            outlineWidth: 3,
          },

          label: {
            text: "Drone 1",

            font: "bold 14px Arial",

            fillColor: Cesium.Color.WHITE,

            outlineColor: Cesium.Color.BLACK,

            outlineWidth: 3,

            style: Cesium.LabelStyle.FILL_AND_OUTLINE,

            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,

            pixelOffset: new Cesium.Cartesian2(0, -18),
          },
        });

       
        viewer.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(
            77.5946,
            12.9716,
            12000
          ),

          orientation: {
            heading: Cesium.Math.toRadians(0),

            pitch: Cesium.Math.toRadians(-60),

            roll: 0,
          },
        });
      } catch (error) {
        console.error("Cesium map failed to initialize:", error);

        if (containerRef.current) {
          containerRef.current.innerHTML = `
            <div style="
              width:100%;
              height:100%;
              display:flex;
              align-items:center;
              justify-content:center;
              background:#071522;
              color:#ffffff;
              font-family:Arial,sans-serif;
              text-align:center;
              padding:20px;
              box-sizing:border-box;
            ">
              <div>
                <h3 style="margin-bottom:8px;">
                  Map unavailable
                </h3>
                <p style="margin:0;color:#9fb3c8;">
                  Unable to load map imagery.
                </p>
              </div>
            </div>
          `;
        }
      }
    };

    createMap();

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
    />
  );
}

export default CesiumMap;