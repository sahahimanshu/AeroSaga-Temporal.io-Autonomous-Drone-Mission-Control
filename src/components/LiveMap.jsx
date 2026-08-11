import { useEffect, useRef } from "react";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { mockDrones } from "../data/mockDrones";

Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN;

export default function LiveMap({ selectedDroneId }) {
  const cesiumContainerRef = useRef(null);
  const viewerRef = useRef(null);
  const entityMapRef = useRef({}); // stores droneId -> Cesium entity

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

    mockDrones.forEach((drone) => {
      const lat = 18.52 + Math.random() * 0.5;
      const lon = 73.85 + Math.random() * 0.5;

      const entity = viewer.entities.add({
        id: drone.id,
        name: drone.id,
        position: Cesium.Cartesian3.fromDegrees(lon, lat, drone.altitude || 100),
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
    });

    viewer.zoomTo(viewer.entities);

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, []);

  // React to search selection: highlight + zoom to that drone
  useEffect(() => {
  const viewer = viewerRef.current;
  if (!viewer) return;

  // Reset all points to normal size first
  Object.values(entityMapRef.current).forEach((entity) => {
    entity.point.pixelSize = 12;
    entity.point.outlineColor = Cesium.Color.WHITE;
    entity.point.outlineWidth = 2;
  });

  if (!selectedDroneId) {
    // No search active — show all drones, zoomed out
    viewer.zoomTo(viewer.entities);
    return;
  }

  const targetEntity = entityMapRef.current[selectedDroneId];
  if (!targetEntity) return;

  // Highlight the selected one
  targetEntity.point.pixelSize = 20;
  targetEntity.point.outlineColor = Cesium.Color.YELLOW;
  targetEntity.point.outlineWidth = 4;

  // Fly camera to it
  viewer.flyTo(targetEntity, {
    duration: 1.5,
    offset: new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-45), 1500),
  });
}, [selectedDroneId]);

  return <div ref={cesiumContainerRef} className="cesium-map-container" />;
}