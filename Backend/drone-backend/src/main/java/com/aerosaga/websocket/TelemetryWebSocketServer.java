package com.aerosaga.websocket;

import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

import java.net.InetSocketAddress;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class TelemetryWebSocketServer extends WebSocketServer {

    // ============================================================
    // CONFIGURATION
    // ============================================================

    private static final int TOTAL_DRONES = 50;

    private static final int UPDATE_INTERVAL_MS = 1000;

    private static final Random RANDOM = new Random();


    // ============================================================
    // DRONE DATA
    // ============================================================

    private static class Drone {

        String id;

        double latitude;
        double longitude;
        double altitude;

        int battery;

        String status;

        String mission;

        int sector;

        double movementDirection;


        Drone(
                String id,
                double latitude,
                double longitude,
                double altitude,
                int battery,
                String status,
                String mission,
                int sector
        ) {

            this.id = id;

            this.latitude = latitude;

            this.longitude = longitude;

            this.altitude = altitude;

            this.battery = battery;

            this.status = status;

            this.mission = mission;

            this.sector = sector;

            this.movementDirection =
                    RANDOM.nextBoolean() ? 1 : -1;
        }
    }


    // ============================================================
    // DRONE LIST
    // ============================================================

    private final List<Drone> drones =
            new ArrayList<>();


    // ============================================================
    // INDIA LOCATIONS
    // ============================================================

    private static final double[][] INDIA_LOCATIONS = {

            {28.6139, 77.2090},   // Delhi
            {19.0760, 72.8777},   // Mumbai
            {13.0827, 80.2707},   // Chennai
            {22.5726, 88.3639},   // Kolkata
            {12.9716, 77.5946},   // Bengaluru

            {17.3850, 78.4867},   // Hyderabad
            {23.0225, 72.5714},   // Ahmedabad
            {26.9124, 75.7873},   // Jaipur
            {11.0168, 76.9558},   // Coimbatore
            {9.9312, 76.2673},    // Kochi

            {8.5241, 76.9366},    // Thiruvananthapuram
            {11.2588, 75.7804},   // Kozhikode
            {15.3173, 75.7139},   // Karnataka
            {15.8497, 74.4977},   // Belagavi
            {16.5062, 80.6480},   // Vijayawada

            {22.5726, 88.3639},
            {25.5941, 85.1376},   // Patna
            {26.1445, 91.7362},   // Guwahati
            {24.8170, 92.7870},   // Assam
            {27.3389, 88.6065},   // Sikkim

            {23.8103, 90.4125},
            {24.5854, 73.7125},
            {22.7196, 75.8577},
            {18.9894, 73.1175},
            {17.6868, 83.2185},

            {20.2961, 85.8245},
            {21.1702, 72.8311},
            {21.1458, 79.0882},
            {30.7333, 76.7794},
            {31.1048, 77.1734},

            {32.7266, 74.8570},
            {28.7041, 77.1025},
            {29.9457, 78.1642},
            {26.8467, 80.9462},
            {25.3176, 82.9739},

            {24.5854, 73.7125},
            {23.2599, 77.4126},
            {22.3072, 73.1812},
            {19.9975, 73.7898},
            {19.2183, 72.9781},

            {18.5204, 73.8567},
            {16.7050, 74.2433},
            {14.4673, 75.9210},
            {13.3409, 74.7421},
            {11.9416, 79.8083},

            {10.8505, 76.2711},
            {9.4981, 76.3388},
            {8.0883, 77.5385},
            {14.6819, 77.6006},
            {15.9129, 79.7400}
    };


    // ============================================================
    // CONSTRUCTOR
    // ============================================================

    public TelemetryWebSocketServer(int port) {

        super(
                new InetSocketAddress(
                        port
                )
        );

        initializeDrones();
    }


    // ============================================================
    // INITIALIZE 50 DRONES
    // ============================================================

    private void initializeDrones() {

        drones.clear();


        for (int i = 0; i < TOTAL_DRONES; i++) {

            String droneId =
                    String.format(
                            "M-%02d",
                            i + 1
                    );


            double latitude =
                    INDIA_LOCATIONS[i][0];

            double longitude =
                    INDIA_LOCATIONS[i][1];


            /*
             * Give every drone a slightly different
             * starting altitude.
             */

            double altitude =
                    100 + (i % 10) * 15;


            /*
             * Battery is deterministic.
             *
             * This means the same drone starts
             * with the same battery.
             */

            int battery =
                    95 - ((i * 7) % 30);


            /*
             * Keep a couple of drones in
             * low battery state for testing.
             */

            if (i == 6) {

                battery = 23;
            }


            if (i == 10) {

                battery = 18;
            }


            String status =
                    battery <= 20
                            ? "LOW_BATTERY"
                            : "ACTIVE";


            String mission;


            if (i < 7) {

                mission =
                        "Mission-" +
                        (104 + i);

            } else {

                mission = "-";
            }


            int sector =
                    (i % 5) + 1;


            drones.add(

                    new Drone(

                            droneId,

                            latitude,

                            longitude,

                            altitude,

                            battery,

                            status,

                            mission,

                            sector
                    )
            );
        }


        System.out.println(
                "Initialized " +
                drones.size() +
                " drones."
        );
    }


    // ============================================================
    // WEBSOCKET START
    // ============================================================

    @Override
    public void onStart() {

        System.out.println(
                "================================================="
        );

        System.out.println(
                "AeroSaga Live Telemetry WebSocket Server"
        );

        System.out.println(
                "WebSocket: ws://localhost:8081"
        );

        System.out.println(
                "Drones: M-01 to M-50"
        );

        System.out.println(
                "Update interval: 1 second"
        );

        System.out.println(
                "================================================="
        );


        /*
         * Start live telemetry loop.
         */

        Thread telemetryThread =
                new Thread(
                        this::telemetryLoop
                );


        telemetryThread.setName(
                "AeroSaga-Telemetry-Thread"
        );


        telemetryThread.setDaemon(true);

        telemetryThread.start();
    }


    // ============================================================
    // LIVE TELEMETRY LOOP
    // ============================================================

    private void telemetryLoop() {

        while (true) {

            try {

                /*
                 * Update every drone.
                 */

                updateDronePositions();


                /*
                 * Send the SAME current state
                 * to every connected client.
                 */

                broadcastTelemetry();


                Thread.sleep(
                        UPDATE_INTERVAL_MS
                );

            } catch (InterruptedException e) {

                Thread.currentThread().interrupt();

                System.out.println(
                        "Telemetry thread stopped."
                );

                break;

            } catch (Exception e) {

                System.err.println(
                        "Telemetry loop error: " +
                        e.getMessage()
                );
            }
        }
    }


    // ============================================================
    // UPDATE DRONE POSITIONS
    // ============================================================

    private synchronized void updateDronePositions() {

        for (Drone drone : drones) {

            /*
             * Small movement so the markers
             * move smoothly on Cesium.
             */

            double latitudeMovement =
                    0.002 *
                    drone.movementDirection;


            double longitudeMovement =
                    0.0025 *
                    drone.movementDirection;


            drone.latitude +=
                    latitudeMovement;


            drone.longitude +=
                    longitudeMovement;


            /*
             * Keep drones inside a reasonable
             * India map area.
             */

            if (
                    drone.latitude > 35 ||
                    drone.latitude < 8
            ) {

                drone.movementDirection *= -1;
            }


            if (
                    drone.longitude > 92 ||
                    drone.longitude < 68
            ) {

                drone.movementDirection *= -1;
            }


            /*
             * Small altitude variation.
             */

            drone.altitude +=
                    drone.movementDirection * 2;


            if (drone.altitude > 250) {

                drone.altitude = 250;

                drone.movementDirection *= -1;
            }


            if (drone.altitude < 80) {

                drone.altitude = 80;

                drone.movementDirection *= -1;
            }


            /*
             * Slowly reduce battery.
             *
             * We only reduce it occasionally so
             * the value doesn't drop too quickly.
             */

            if (
                    RANDOM.nextInt(20) == 0 &&
                    drone.battery > 5
            ) {

                drone.battery--;
            }


            /*
             * Update status from battery.
             */

            if (drone.battery <= 20) {

                drone.status =
                        "LOW_BATTERY";

            } else {

                drone.status =
                        "ACTIVE";
            }
        }
    }


    // ============================================================
    // SEND TELEMETRY
    // ============================================================

    private synchronized void broadcastTelemetry() {

        if (getConnections().isEmpty()) {

            return;
        }


        for (Drone drone : drones) {

            String json =
                    createTelemetryJson(
                            drone
                    );


            /*
             * IMPORTANT:
             *
             * Every connected frontend receives
             * the exact same battery value.
             */

            broadcast(json);
        }


        System.out.println(
                "Sent telemetry for " +
                drones.size() +
                " drones"
        );
    }


    // ============================================================
    // CREATE JSON
    // ============================================================

    private String createTelemetryJson(
            Drone drone
    ) {

        return "{"

                + "\"droneId\":\""
                + drone.id
                + "\","

                + "\"latitude\":"
                + formatDouble(
                        drone.latitude
                )
                + ","

                + "\"longitude\":"
                + formatDouble(
                        drone.longitude
                )
                + ","

                + "\"altitude\":"
                + formatDouble(
                        drone.altitude
                )
                + ","

                + "\"battery\":"
                + drone.battery
                + ","

                + "\"status\":\""
                + drone.status
                + "\","

                + "\"mission\":\""
                + drone.mission
                + "\","

                + "\"sector\":\"Sector "
                + (char)
                (
                        'A' +
                        drone.sector -
                        1
                )
                + "\""

                + "}";
    }


    // ============================================================
    // FORMAT DOUBLE
    // ============================================================

    private String formatDouble(
            double value
    ) {

        return String.format(
                java.util.Locale.US,
                "%.6f",
                value
        );
    }


    // ============================================================
    // CLIENT CONNECTED
    // ============================================================

    @Override
    public void onOpen(
            WebSocket conn,
            ClientHandshake handshake
    ) {

        System.out.println(
                "Frontend connected: " +
                conn.getRemoteSocketAddress()
        );


        /*
         * Immediately send current telemetry
         * to the newly connected frontend.
         */

        synchronized (this) {

            for (Drone drone : drones) {

                conn.send(
                        createTelemetryJson(
                                drone
                        )
                );
            }
        }
    }


    // ============================================================
    // CLIENT DISCONNECTED
    // ============================================================

    @Override
    public void onClose(
            WebSocket conn,
            int code,
            String reason,
            boolean remote
    ) {

        System.out.println(
                "Frontend disconnected: " +
                conn.getRemoteSocketAddress()
        );
    }


    // ============================================================
    // MESSAGE RECEIVED
    // ============================================================

    @Override
    public void onMessage(
            WebSocket conn,
            String message
    ) {

        System.out.println(
                "Received message: " +
                message
        );
    }


    // ============================================================
    // ERROR
    // ============================================================

    @Override
    public void onError(
            WebSocket conn,
            Exception ex
    ) {

        System.err.println(
                "WebSocket error: " +
                ex.getMessage()
        );
    }
}