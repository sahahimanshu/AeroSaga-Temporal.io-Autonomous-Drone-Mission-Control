package com.aerosaga.backend.workflow;

import io.temporal.client.WorkflowClient;
import io.temporal.client.WorkflowOptions;
import io.temporal.serviceclient.WorkflowServiceStubs;
import io.temporal.worker.Worker;
import io.temporal.worker.WorkerFactory;

import java.util.List;

public class FleetMissionStarter {

    public static final String TASK_QUEUE = "MISSION_TASK_QUEUE";

    public static void main(String[] args) {

        WorkflowServiceStubs service = WorkflowServiceStubs.newLocalServiceStubs();
        WorkflowClient client = WorkflowClient.newInstance(service);

        WorkerFactory factory = WorkerFactory.newInstance(client);
        Worker worker = factory.newWorker(TASK_QUEUE);

        // Register BOTH the parent and child workflow types on the same worker
        worker.registerWorkflowImplementationTypes(
                FleetMissionWorkflowImpl.class,
                MissionWorkflowImpl.class
        );
        worker.registerActivitiesImplementations(new MissionActivitiesImpl());

        factory.start();

        System.out.println("Worker started. Listening on task queue: " + TASK_QUEUE);

        FleetMissionWorkflow fleetWorkflow = client.newWorkflowStub(
                FleetMissionWorkflow.class,
                WorkflowOptions.newBuilder()
                        .setTaskQueue(TASK_QUEUE)
                        .setWorkflowId("fleet-mission-1")
                        .build()
        );

        List<String> droneIds = List.of("DR-001", "DR-002", "DR-003");

        String result = fleetWorkflow.runFleetMission(droneIds, "Sector-A");

        System.out.println("Fleet result: " + result);

        System.exit(0);
    }
}