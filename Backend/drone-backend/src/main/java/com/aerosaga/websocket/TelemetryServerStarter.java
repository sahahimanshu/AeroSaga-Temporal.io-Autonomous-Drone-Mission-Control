package com.aerosaga.websocket;

public class TelemetryServerStarter {

    public static void main(String[] args) {

        TelemetryWebSocketServer server =
                new TelemetryWebSocketServer();

        server.start();

        System.out.println("Telemetry server is running...");
    }
}