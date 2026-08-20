package com.aerosaga.backend.workflow;

import io.temporal.client.WorkflowClient;
import io.temporal.client.WorkflowOptions;
import io.temporal.serviceclient.WorkflowServiceStubs;
import io.temporal.worker.Worker;
import io.temporal.worker.WorkerFactory;

public class WorkflowStarter {

    public static final String TASK_QUEUE = "TAKEOFF_TASK_QUEUE";

    public static void main(String[] args) {
        // 1. Connect to the Temporal server running in Docker
        WorkflowServiceStubs service = WorkflowServiceStubs.newLocalServiceStubs();
        WorkflowClient client = WorkflowClient.newInstance(service);

        // 2. Create a worker that will execute Workflow and Activity code
        WorkerFactory factory = WorkerFactory.newInstance(client);
        Worker worker = factory.newWorker(TASK_QUEUE);

        worker.registerWorkflowImplementationTypes(TakeoffWorkflowImpl.class);
        worker.registerActivitiesImplementations(new TakeoffActivityImpl());

        // 3. Start the worker (it will now listen for workflow tasks)
        factory.start();

        System.out.println("Worker started. Listening on task queue: " + TASK_QUEUE);

        // 4. Trigger a new workflow execution
        TakeoffWorkflow workflow = client.newWorkflowStub(
                TakeoffWorkflow.class,
                WorkflowOptions.newBuilder()
                        .setTaskQueue(TASK_QUEUE)
                        .setWorkflowId("takeoff-DR-001")
                        .build()
        );

        String result = workflow.takeoff("DR-001");

        System.out.println("Workflow result: " + result);

        System.exit(0);
    }
}