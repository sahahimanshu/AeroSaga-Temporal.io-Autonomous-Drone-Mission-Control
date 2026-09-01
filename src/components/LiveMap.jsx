import { useEffect, useRef } from "react";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN;

export default function LiveMap({ selectedDroneId, drones }) {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const entitiesRef = useRef({});

  // Initialize viewer once
  useEffect(() => {
    const viewer = new Cesium.Viewer(containerRef.current, {
      timeline: false,
      animation: false,
      baseLayerPicker: false,
      geocoder: false,
      navigationHelpButton: false,
      sceneModePicker: false,
      fullscreenButton: false,
      homeButton: false,
    });

    viewerRef.current = viewer;

    return () => {
      viewer.destroy();
      viewerRef.current = null;
      entitiesRef.current = {};
    };
  }, []);

  // Sync entities with drones prop
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !drones || drones.length === 0) return;

    drones.forEach((drone) => {
      const lon = drone.lng;
      const lat = drone.lat;

      if (typeof lon !== "number" || typeof lat !== "number") {
        return;
      }

      const cartesian = Cesium.Cartesian3.fromDegrees(lon, lat, drone.altitude || 100);

      if (entitiesRef.current[drone.id]) {
        entitiesRef.current[drone.id].position = cartesian;
      } else {
        const isSelected = drone.id === selectedDroneId;
        const newEntity = viewer.entities.add({
          id: drone.id,
          position: cartesian,
          point: {
            pixelSize: isSelected ? 18 : 10,
            color: isSelected
              ? Cesium.Color.RED
              : drone.status === "Active"
              ? Cesium.Color.LIME
              : Cesium.Color.ORANGE,
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 2,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          },
          label: {
            text: drone.id,
            font: "12px sans-serif",
            fillColor: Cesium.Color.WHITE,
            pixelOffset: new Cesium.Cartesian2(0, -20),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          },
        });
        entitiesRef.current[drone.id] = newEntity;
      }
    });

    // Fit camera to show all entities, once entities exist
    viewer.zoomTo(viewer.entities);
  }, [drones]);

  // Update styling + fly camera on selection change
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    Object.entries(entitiesRef.current).forEach(([id, entity]) => {
      const isSelected = id === selectedDroneId;
      entity.point.pixelSize = isSelected ? 18 : 10;
      entity.point.color = isSelected ? Cesium.Color.RED : entity.point.color;
      entity.point.outlineColor = isSelected ? Cesium.Color.YELLOW : Cesium.Color.WHITE;
      entity.point.outlineWidth = isSelected ? 4 : 2;
    });

    if (selectedDroneId && entitiesRef.current[selectedDroneId]) {
      viewer.zoomTo(entitiesRef.current[selectedDroneId]);
    }
  }, [selectedDroneId]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", minHeight: "500px" }}
    />
  );
}