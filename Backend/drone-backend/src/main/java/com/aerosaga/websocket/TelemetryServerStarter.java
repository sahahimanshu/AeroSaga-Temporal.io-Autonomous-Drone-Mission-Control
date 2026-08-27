package com.aerosaga.websocket;

public class TelemetryServerStarter {

    public static void main(String[] args) {

        TelemetryWebSocketServer server =
                new TelemetryWebSocketServer(8081);

        server.start();

        System.out.println(
                "Telemetry server is running..."
        );
    }
}
