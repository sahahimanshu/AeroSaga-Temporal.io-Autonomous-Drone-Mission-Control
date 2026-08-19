import { useEffect, useRef } from "react";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN;

export default function LiveMap({ selectedDroneId, drones }) {
  const cesiumContainerRef = useRef(null);
  const viewerRef = useRef(null);
  const entityMapRef = useRef({}); // stores droneId -> Cesium entity
  const initializedRef = useRef(false);

  // Create the map ONCE
  useEffect(() => {
    if (viewerRef.current) return;

    const viewer = new Cesium.Viewer(cesiumContainerRef.current, {
      timeline: false,
      animation: false,
      baseLayerPicker: false,
      geocoder: false,
      homeButton: true,
      navigationHelpButton: false,
      sceneModePicker: false,
      fullscreenButton: false,
    });

    viewerRef.current = viewer;

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, []);

  // Create or update entities whenever drone data changes
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !drones) return;

    drones.forEach((drone) => {
      const position = Cesium.Cartesian3.fromDegrees(
        drone.lng,
        drone.lat,
        drone.altitude || 100
      );

      const existing = entityMapRef.current[drone.id];

      if (existing) {
        existing.position = position;
      } else {
        const entity = viewer.entities.add({
          id: drone.id,
          name: drone.id,
          position: position,
          point: {
            pixelSize: 12,
            color: drone.status === "Active" ? Cesium.Color.LIME : Cesium.Color.ORANGE,
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 2,
          },
          label: {
            text: drone.id,
            font: "12px sans-serif",
            fillColor: Cesium.Color.WHITE,
            pixelOffset: new Cesium.Cartesian2(0, -20),
          },
        });
        entityMapRef.current[drone.id] = entity;
      }
    });

    if (!initializedRef.current && drones.length > 0) {
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(73.86, 18.52, 15000),
        duration: 1.5,
      });
      initializedRef.current = true;
    }
  }, [drones]);

  // React to search selection: highlight + zoom to that drone
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    Object.values(entityMapRef.current).forEach((entity) => {
      entity.point.pixelSize = 12;
      entity.point.outlineColor = Cesium.Color.WHITE;
      entity.point.outlineWidth = 2;
    });

    if (!selectedDroneId) {
      viewer.zoomTo(viewer.entities);
      return;
    }

    const targetEntity = entityMapRef.current[selectedDroneId];
    if (!targetEntity) return;

    targetEntity.point.pixelSize = 20;
    targetEntity.point.outlineColor = Cesium.Color.YELLOW;
    targetEntity.point.outlineWidth = 4;

    viewer.flyTo(targetEntity, {
      duration: 1.5,
      offset: new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-45), 1500),
    });
  }, [selectedDroneId]);

  return <div ref={cesiumContainerRef} className="cesium-map-container" />;
}