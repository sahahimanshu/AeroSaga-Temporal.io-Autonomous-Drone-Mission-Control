package com.aerosaga;
import com.aerosaga.workflow.MissionSagaWorkflow;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpsServer;
import io.temporal.client.WorkflowClient;
import io.temporal.serviceclient.WorkflowServiceStubs;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.security.Provider.Service;
public class MissionStateApiStarter {

    private static final int PORT = 8082;

    public static void main(String[] args) throws Exception {

        // Connect to local Temporal server
        WorkflowServiceStubs service =
                WorkflowServiceStubs.newLocalServiceStubs();

        WorkflowClient client =
                WorkflowClient.newInstance(service);

        // Create HTTP server
        HttpServer server =
                HttpServer.create(new InetSocketAddress(PORT), 0);

        server.createContext("/api/missions", exchange -> {

            addCorsHeaders(exchange);

            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            String path = exchange.getRequestURI().getPath();

            // Expected:
            // /api/missions/SAGA-TEST-002/state
            String prefix = "/api/missions/";

            if (!path.startsWith(prefix) || !path.endsWith("/state")) {
                sendResponse(
                        exchange,
                        404,
                        "{\"error\":\"Invalid endpoint\"}"
                );
                return;
            }

            String workflowId =
                    path.substring(
                            prefix.length(),
                            path.length() - "/state".length()
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
        });

        server.setExecutor(null);
        server.start();

        System.out.println("======================================");
        System.out.println("🚁 AeroSaga Mission State API started");
        System.out.println("📡 Port: " + PORT);
        System.out.println(
                "🔗 http://localhost:" + PORT +
                "/api/missions/SAGA-TEST-002/state"
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
                "GET, OPTIONS"
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