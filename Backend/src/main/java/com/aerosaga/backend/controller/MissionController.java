package com.aerosaga.backend.controller;

import com.aerosaga.backend.workflow.MissionWorkflow;
import io.temporal.client.WorkflowClient;
import io.temporal.client.WorkflowOptions;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/missions")
@CrossOrigin(origins = "http://localhost:5173")
public class MissionController {

    private static final String TASK_QUEUE = "MISSION_TASK_QUEUE";

    private final WorkflowClient workflowClient;

    public MissionController(WorkflowClient workflowClient) {
        this.workflowClient = workflowClient;
    }

    @PostMapping("/start")
    public ResponseEntity<String> startMission(
            @RequestParam String droneId,
            @RequestParam String waypoint) {

        String workflowId = "mission-" + droneId + "-" + System.currentTimeMillis();

        MissionWorkflow workflow = workflowClient.newWorkflowStub(
                MissionWorkflow.class,
                WorkflowOptions.newBuilder()
                        .setTaskQueue(TASK_QUEUE)
                        .setWorkflowId(workflowId)
                        .build()
        );

        WorkflowClient.start(
                workflow::runMission,
                droneId,
                waypoint
        );

        return ResponseEntity.ok(
                "Mission started successfully. Workflow ID: " + workflowId
        );
    }
}