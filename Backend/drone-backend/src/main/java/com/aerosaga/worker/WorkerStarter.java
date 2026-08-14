package com.aerosaga.worker;

import com.aerosaga.activity.TakeoffActivityImpl;
import com.aerosaga.workflow.DroneTakeoffWorkflowImpl;

import io.temporal.client.WorkflowClient;
import io.temporal.serviceclient.WorkflowServiceStubs;
import io.temporal.worker.Worker;
import io.temporal.worker.WorkerFactory;

public class WorkerStarter {

    public static final String TASK_QUEUE = "DRONE_TASK_QUEUE";

    public static void main(String[] args) {

        // Connect to Temporal Server
        WorkflowServiceStubs service =
                WorkflowServiceStubs.newLocalServiceStubs();

        // Create Temporal Client
        WorkflowClient client =
                WorkflowClient.newInstance(service);

        // Create Worker Factory
        WorkerFactory factory =
                WorkerFactory.newInstance(client);

        // Create Worker
        Worker worker =
                factory.newWorker(TASK_QUEUE);

        // Register Workflow
        worker.registerWorkflowImplementationTypes(
                DroneTakeoffWorkflowImpl.class
        );

        // Register Activity
        worker.registerActivitiesImplementations(
                new TakeoffActivityImpl()
        );

        // Start Worker
        factory.start();

        System.out.println("🚁 AeroSaga Temporal Worker started!");
        System.out.println("📡 Task Queue: " + TASK_QUEUE);
    }
}