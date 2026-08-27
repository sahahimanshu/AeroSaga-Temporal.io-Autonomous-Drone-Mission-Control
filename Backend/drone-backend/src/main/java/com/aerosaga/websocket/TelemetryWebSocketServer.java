package com.aerosaga.websocket;

import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

import java.net.InetSocketAddress;

public class TelemetryWebSocketServer extends WebSocketServer {

    private static final int DRONE_COUNT = 50;
     private static final double[][] INDIA_LOCATIONS = {

           
            {28.6139, 77.2090},   
            {30.7333, 76.7794},   
            {31.1048, 77.1734},   
            {32.7266, 74.8570},   
            {30.3165, 78.0322},   
            {29.9457, 78.1642},   
            {26.8467, 80.9462},   
            {25.4358, 81.8463},   
            {27.1767, 78.0081},  
            {26.9124, 75.7873},  
            {19.0760, 72.8777},   
            {18.5204, 73.8567},   
            {21.1702, 72.8311},   
            {23.0225, 72.5714},   
            {22.3072, 73.1812},   
            {21.6417, 69.6293},   
            {20.5937, 78.9629},   
            {21.1458, 79.0882},   
            {19.9975, 73.7898},  
            {24.5854, 73.7125},   
            {23.2599, 77.4126},   
            {22.7196, 75.8577},   
            {21.2514, 81.6296},  
            {23.1815, 79.9864},   
            {24.8170, 93.9368},   
            {23.3441, 85.3096},   
            {22.8046, 86.2029},  
            {20.2961, 85.8245},   
            {19.8135, 85.8312},  
            {21.4669, 84.0050},   
            {12.9716, 77.5946},   
            {13.0827, 80.2707},   
            {17.3850, 78.4867},   
            {11.0168, 76.9558},   
            {9.9312, 76.2673},    
            {8.5241, 76.9366},    
            {11.2588, 75.7804},  
            {15.3173, 75.7139},   
            {15.8497, 74.4977},   
            {16.5062, 80.6480},   
            {22.5726, 88.3639},   
            {25.5941, 85.1376},   
            {26.1445, 91.7362},   
            {24.8170, 92.7870},   
            {27.3389, 88.6065},   
            {23.8103, 90.4125},   
            {24.5854, 73.7125},   
            {22.7196, 75.8577},   
            {18.9894, 73.1175},   
            {17.6868, 83.2185}    
    };

    private final double[] latitudes = new double[DRONE_COUNT];
    private final double[] longitudes = new double[DRONE_COUNT];
    private final int[] batteries = new int[DRONE_COUNT];

    public TelemetryWebSocketServer(int port) {

        super(new InetSocketAddress(port));

        for (int i = 0; i < DRONE_COUNT; i++) {

            latitudes[i] = INDIA_LOCATIONS[i][0];
            longitudes[i] = INDIA_LOCATIONS[i][1];

            batteries[i] = 100;
        }
    }

    @Override
    public void onOpen(WebSocket conn, ClientHandshake handshake) {

        System.out.println(
                "WebSocket client connected: "
                        + conn.getRemoteSocketAddress()
        );
    }

    @Override
    public void onClose(
            WebSocket conn,
            int code,
            String reason,
            boolean remote
    ) {

        System.out.println("WebSocket client disconnected.");
    }

    @Override
    public void onMessage(
            WebSocket conn,
            String message
    ) {

        System.out.println("Received: " + message);
    }

    @Override
    public void onError(
            WebSocket conn,
            Exception ex
    ) {

        System.out.println(
                "WebSocket error: " + ex.getMessage()
        );
    }

    @Override
    public void onStart() {

        System.out.println(
                "Telemetry WebSocket Server started!"
        );

        System.out.println(
                "WebSocket: ws://localhost:8081"
        );

        System.out.println(
                "Sending telemetry for "
                        + DRONE_COUNT
                        + " drones across India"
        );

        new Thread(() -> {

            while (true) {

                for (int i = 0; i < DRONE_COUNT; i++) {

                   
                    latitudes[i] += 0.0001;
                    longitudes[i] += 0.0001;

                    
                    batteries[i]--;

                    if (batteries[i] <= 20) {
                        batteries[i] = 100;
                    }

                    String droneId =
                            String.format(
                                    "M-%03d",
                                    i + 1
                            );

                    String telemetry =
                            String.format(
                                    "{\"droneId\":\"%s\","
                                            + "\"latitude\":%.6f,"
                                            + "\"longitude\":%.6f,"
                                            + "\"altitude\":120,"
                                            + "\"battery\":%d,"
                                            + "\"status\":\"Online\"}",
                                    droneId,
                                    latitudes[i],
                                    longitudes[i],
                                    batteries[i]
                            );

                    broadcast(telemetry);
                }

                System.out.println(
                        "Sent telemetry for "
                                + DRONE_COUNT
                                + " drones across India"
                );

                try {

                    Thread.sleep(2000);

                } catch (InterruptedException e) {

                    Thread.currentThread().interrupt();

                    break;
                }
            }

        }).start();
    }
}
