import { useState, useEffect, useRef } from "react";
import { mockDrones } from "../data/mockDrones";

export function useSimulatedTelemetry(intervalMs = 2000) {
  const [drones, setDrones] = useState(mockDrones);
  const dronesRef = useRef(mockDrones);

  useEffect(() => {
    const interval = setInterval(() => {
      dronesRef.current = dronesRef.current.map((drone) => {
        // Standby drones don't move
        if (drone.status === "Standby" || drone.speed === 0) {
          return drone;
        }

        // Small random nudge to simulate GPS movement
        const latDelta = (Math.random() - 0.5) * 0.004;
        const lngDelta = (Math.random() - 0.5) * 0.004;

        // Battery slowly drains for active drones
        const batteryDrain = drone.status === "Returning" ? 0 : 0.2;
        const newBattery = Math.max(0, +(drone.battery - batteryDrain).toFixed(1));

        return {
          ...drone,
          lat: +(drone.lat + latDelta).toFixed(6),
          lng: +(drone.lng + lngDelta).toFixed(6),
          battery: newBattery,
        };
      });

      setDrones([...dronesRef.current]);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs]);

  return drones;
}