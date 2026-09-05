package com.aerosaga;

import com.aerosaga.workflow.MissionSagaWorkflow;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import io.temporal.client.WorkflowClient;
import io.temporal.serviceclient.WorkflowServiceStubs;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;

public class MissionStateApiStarter {

    private static final int PORT = 8082;

    public static void main(String[] args) throws Exception {

     
        WorkflowServiceStubs service =
                WorkflowServiceStubs.newLocalServiceStubs();

        WorkflowClient client =
                WorkflowClient.newInstance(service);

       
        HttpServer server =
                HttpServer.create(new InetSocketAddress(PORT), 0);

        server.createContext("/api/missions", exchange -> {

            addCorsHeaders(exchange);

            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            String path = exchange.getRequestURI().getPath();

            String prefix = "/api/missions/";

            if (!path.startsWith(prefix)) {
                sendResponse(
                        exchange,
                        404,
                        "{\"error\":\"Invalid endpoint\"}"
                );
                return;
            }

            String remainingPath =
                    path.substring(prefix.length());

            

            if (remainingPath.endsWith("/state")) {

                String workflowId =
                        remainingPath.substring(
                                0,
                                remainingPath.length() - "/state".length()
                        );

                try {

                    MissionSagaWorkflow workflow =
                            client.newWorkflowStub(
                                    MissionSagaWorkflow.class,
                                    workflowId
                            );

                    String state =
                            workflow.getMissionState();

                    String json =
                            "{\"workflowId\":\""
                                    + workflowId
                                    + "\",\"state\":\""
                                    + state
                                    + "\"}";

                    sendResponse(exchange, 200, json);

                } catch (Exception e) {

                    e.printStackTrace();

                    sendResponse(
                            exchange,
                            500,
                            "{\"error\":\"Unable to query workflow state\"}"
                    );
                }

                return;
            }

            
            if (remainingPath.endsWith("/abort")) {

                if (!"POST".equalsIgnoreCase(
                        exchange.getRequestMethod())) {

                    sendResponse(
                            exchange,
                            405,
                            "{\"error\":\"POST method required\"}"
                    );

                    return;
                }

                String workflowId =
                        remainingPath.substring(
                                0,
                                remainingPath.length() - "/abort".length()
                        );

                try {

                    MissionSagaWorkflow workflow =
                            client.newWorkflowStub(
                                    MissionSagaWorkflow.class,
                                    workflowId
                            );

                    
                    workflow.emergencyAbort();

                    String json =
                            "{\"workflowId\":\""
                                    + workflowId
                                    + "\",\"message\":\"Emergency abort signal sent\"}";

                    sendResponse(exchange, 200, json);

                } catch (Exception e) {

                    e.printStackTrace();

                    sendResponse(
                            exchange,
                            500,
                            "{\"error\":\"Unable to send emergency abort signal\"}"
                    );
                }

                return;
            }

            sendResponse(
                    exchange,
                    404,
                    "{\"error\":\"Unknown endpoint\"}"
            );
        });

        server.setExecutor(null);
        server.start();

        System.out.println("======================================");
        System.out.println("🚁 AeroSaga Mission State API started");
        System.out.println("📡 Port: " + PORT);
        System.out.println("📊 State API:");
        System.out.println(
                "http://localhost:" + PORT +
                "/api/missions/{workflowId}/state"
        );
        System.out.println("🚨 Abort API:");
        System.out.println(
                "POST http://localhost:" + PORT +
                "/api/missions/{workflowId}/abort"
        );
        System.out.println("======================================");
    }

    private static void addCorsHeaders(HttpExchange exchange) {

        exchange.getResponseHeaders().add(
                "Access-Control-Allow-Origin",
                "*"
        );

        exchange.getResponseHeaders().add(
                "Access-Control-Allow-Methods",
                "GET, POST, OPTIONS"
        );

        exchange.getResponseHeaders().add(
                "Access-Control-Allow-Headers",
                "Content-Type"
        );
    }

    private static void sendResponse(
            HttpExchange exchange,
            int status,
            String response
    ) throws IOException {

        byte[] bytes =
                response.getBytes(StandardCharsets.UTF_8);

        exchange.getResponseHeaders().set(
                "Content-Type",
                "application/json"
        );

        exchange.sendResponseHeaders(
                status,
                bytes.length
        );

        try (OutputStream output =
                     exchange.getResponseBody()) {

            output.write(bytes);
        }
    }
}