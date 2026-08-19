package com.aerosaga.websocket;

import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

import java.net.InetSocketAddress;

public class TelemetryWebSocketServer extends WebSocketServer {

    public TelemetryWebSocketServer() {
        super(new InetSocketAddress(8081));
    }

    @Override
    public void onOpen(WebSocket conn, ClientHandshake handshake) {
        System.out.println("WebSocket client connected: " + conn.getRemoteSocketAddress());
    }

    @Override
    public void onClose(WebSocket conn, int code, String reason, boolean remote) {
        System.out.println("WebSocket client disconnected.");
    }

    @Override
    public void onMessage(WebSocket conn, String message) {
        System.out.println("Received: " + message);
    }

    @Override
    public void onError(WebSocket conn, Exception ex) {
        System.out.println("WebSocket error: " + ex.getMessage());
    }

    @Override
    public void onStart() {
        System.out.println("🚁 Telemetry WebSocket Server started!");
        System.out.println("📡 WebSocket: ws://localhost:8081");
        new Thread(() -> {
           double latitude = 22.5726;
           double longitude = 88.3639;
           int battery = 100;

           while(true) {
            latitude += 0.0001;
            longitude += 0.0001;
            battery --;

            if(battery <= 20) {
                battery = 100;
            }
            String telemetry = String.format ( "{\"droneId\":\"M-102\",\"latitude\":%.6f,\"longitude\":%.6f,\"altitude\":120,\"battery\":%d,\"status\":\"Online\"}",latitude,longitude,battery);
            broadcast(telemetry);
            System.err.println("Sent telemetry :"+telemetry);

            try{
                Thread.sleep(2000);
            } catch(InterruptedException e){
                Thread.currentThread().interrupt();
                break;
            }
           }


        }).start();
    }
}