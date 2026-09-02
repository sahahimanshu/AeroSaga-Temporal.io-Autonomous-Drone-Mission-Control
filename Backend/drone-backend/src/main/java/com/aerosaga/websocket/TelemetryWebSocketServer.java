package com.aerosaga.websocket;

import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

import java.net.InetSocketAddress;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class TelemetryWebSocketServer extends WebSocketServer {

    private static final int PORT = 8090;
    private static final int DRONE_COUNT = 50;

    private final List<DroneState> drones = new ArrayList<>();
    private final Random random = new Random();

    public TelemetryWebSocketServer() {
        super(new InetSocketAddress(PORT));

        initializeDrones();
    }

    // ============================================================
    // INITIALIZE 50 DRONES
    // ============================================================

    private void initializeDrones() {

        double baseLatitude = 22.5726;
        double baseLongitude = 88.3639;

        for (int i = 1; i <= DRONE_COUNT; i++) {

            String droneId =
                    String.format("DR-%03d", i);

            double latitude =
                    baseLatitude
                            + (random.nextDouble() - 0.5) * 0.15;

            double longitude =
                    baseLongitude
                            + (random.nextDouble() - 0.5) * 0.15;

            int battery =
                    60 + random.nextInt(41);

            drones.add(
                    new DroneState(
                            droneId,
                            latitude,
                            longitude,
                            120,
                            battery
                    )
            );
        }
    }

    // ============================================================
    // CLIENT CONNECTED
    // ============================================================

    @Override
    public void onOpen(
            WebSocket conn,
            ClientHandshake handshake) {

        System.out.println(
                "WebSocket client connected: "
                        + conn.getRemoteSocketAddress()
        );
    }

    // ============================================================
    // CLIENT DISCONNECTED
    // ============================================================

    @Override
    public void onClose(
            WebSocket conn,
            int code,
            String reason,
            boolean remote) {

        System.out.println(
                "WebSocket client disconnected: "
                        + reason
        );
    }

    // ============================================================
    // MESSAGE FROM CLIENT
    // ============================================================

    @Override
    public void onMessage(
            WebSocket conn,
            String message) {

        System.out.println(
                "Received from client: "
                        + message
        );
    }

    // ============================================================
    // ERROR
    // ============================================================

    @Override
    public void onError(
            WebSocket conn,
            Exception ex) {

        System.out.println(
                "WebSocket error: "
                        + ex.getMessage()
        );
    }

    // ============================================================
    // SERVER START
    // ============================================================

    @Override
    public void onStart() {

        System.out.println(
                "Telemetry WebSocket Server started!"
        );

        System.out.println(
                "WebSocket: ws://localhost:" + PORT
        );

        System.out.println(
                "Live drones: " + DRONE_COUNT
        );

        startTelemetryLoop();
    }

    // ============================================================
    // TELEMETRY LOOP
    // ============================================================

    private void startTelemetryLoop() {

        Thread telemetryThread =
                new Thread(() -> {

                    while (!Thread.currentThread().isInterrupted()) {

                        for (DroneState drone : drones) {

                            updateDronePosition(drone);

                            String telemetry =
                                    createTelemetryJson(drone);

                            broadcast(telemetry);
                        }

                        System.out.println(
                                "Sent telemetry for "
                                        + drones.size()
                                        + " drones"
                        );

                        try {
                            Thread.sleep(2000);
                        } catch (InterruptedException e) {

                            Thread.currentThread()
                                    .interrupt();

                            break;
                        }
                    }
                });

        telemetryThread.setName(
                "drone-telemetry-thread"
        );

        telemetryThread.setDaemon(true);

        telemetryThread.start();
    }

    // ============================================================
    // UPDATE DRONE POSITION
    // ============================================================

    private void updateDronePosition(
            DroneState drone) {

        drone.latitude +=
                (random.nextDouble() - 0.5)
                        * 0.001;

        drone.longitude +=
                (random.nextDouble() - 0.5)
                        * 0.001;

        // Small altitude movement
        drone.altitude =
                100 + random.nextInt(81);

        // Battery slowly decreases
        drone.battery--;

        if (drone.battery <= 20) {

            // Recharge simulation
            drone.battery = 100;
        }
    }

    // ============================================================
    // CREATE JSON
    // ============================================================

    private String createTelemetryJson(
            DroneState drone) {

        String status;

        if (drone.battery <= 20) {
            status = "Warning";
        } else {
            status = "Online";
        }

        return String.format(
                "{\"droneId\":\"%s\","
                        + "\"latitude\":%.6f,"
                        + "\"longitude\":%.6f,"
                        + "\"altitude\":%d,"
                        + "\"battery\":%d,"
                        + "\"status\":\"%s\"}",
                drone.droneId,
                drone.latitude,
                drone.longitude,
                drone.altitude,
                drone.battery,
                status
        );
    }

    // ============================================================
    // DRONE STATE
    // ============================================================

    private static class DroneState {

        private final String droneId;

        private double latitude;

        private double longitude;

        private int altitude;

        private int battery;

        private DroneState(
                String droneId,
                double latitude,
                double longitude,
                int altitude,
                int battery) {

            this.droneId = droneId;

            this.latitude = latitude;

            this.longitude = longitude;

            this.altitude = altitude;

            this.battery = battery;
        }
    }
}