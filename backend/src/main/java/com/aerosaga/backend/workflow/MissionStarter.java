/*package com.aerosaga.backend.workflow;

import io.temporal.client.WorkflowClient;
import io.temporal.client.WorkflowOptions;
import io.temporal.serviceclient.WorkflowServiceStubs;
import io.temporal.worker.Worker;
import io.temporal.worker.WorkerFactory;

public class MissionStarter {

    public static final String TASK_QUEUE = "MISSION_TASK_QUEUE";

    public static void main(String[] args) {
        // 1. Connect to the Temporal server running in Docker
        WorkflowServiceStubs service = WorkflowServiceStubs.newLocalServiceStubs();
        WorkflowClient client = WorkflowClient.newInstance(service);

        // 2. Create a worker that will execute Workflow and Activity code
        WorkerFactory factory = WorkerFactory.newInstance(client);
        Worker worker = factory.newWorker(TASK_QUEUE);

        worker.registerWorkflowImplementationTypes(MissionWorkflowImpl.class);
        worker.registerActivitiesImplementations(new MissionActivitiesImpl());

        // 3. Start the worker (it will now listen for workflow tasks)
        factory.start();

        System.out.println("Worker started. Listening on task queue: " + TASK_QUEUE);

        // 4. Trigger a new mission workflow execution
        MissionWorkflow workflow = client.newWorkflowStub(
                MissionWorkflow.class,
                WorkflowOptions.newBuilder()
                        .setTaskQueue(TASK_QUEUE)
                        .setWorkflowId("mission-DR-001")
                        .build()
        );

        String result = workflow.runMission("DR-001", "Sector-A");

        System.out.println("Mission result: " + result);

        System.exit(0);
    }
}*/

package com.aerosaga.backend.workflow;

import io.temporal.client.WorkflowClient;
import io.temporal.client.WorkflowOptions;
import io.temporal.serviceclient.WorkflowServiceStubs;
import io.temporal.worker.Worker;
import io.temporal.worker.WorkerFactory;

public class MissionStarter {

    public static final String TASK_QUEUE = "MISSION_TASK_QUEUE";

    public static void main(String[] args) {

        // 1. Connect to the Temporal server running in Docker
        WorkflowServiceStubs service =
                WorkflowServiceStubs.newLocalServiceStubs();

        WorkflowClient client =
                WorkflowClient.newInstance(service);

        // 2. Create worker
        WorkerFactory factory =
                WorkerFactory.newInstance(client);

        Worker worker =
                factory.newWorker(TASK_QUEUE);

        worker.registerWorkflowImplementationTypes(
                MissionWorkflowImpl.class
        );

        MissionActivitiesImpl activitiesImpl = new MissionActivitiesImpl();
        activitiesImpl.setSimulateFailures(true); // enable random failures to demo compensation logic
        worker.registerActivitiesImplementations(activitiesImpl);
        
        // 3. Start worker
        factory.start();

        System.out.println(
                "Worker started. Listening on task queue: "
                        + TASK_QUEUE
        );

        // 4. Create workflow stub
        MissionWorkflow workflow =
                client.newWorkflowStub(
                        MissionWorkflow.class,
                        WorkflowOptions.newBuilder()
                                .setTaskQueue(TASK_QUEUE)
                                .setWorkflowId("mission-DR-001-" + System.currentTimeMillis())
                                .build()
                );

        // 5. Start workflow asynchronously
        WorkflowClient.start(
                workflow::runMission,
                "DR-001",
                "Sector-A"
        );

        System.out.println("Mission workflow started.");

        // 6. Query current step
        System.out.println(
                "Current mission step: "
                        + workflow.getCurrentStep()
        );

        // Wait 1.5 seconds
        sleep(1500);

        // 7. Query again
        System.out.println(
                "Current mission step: "
                        + workflow.getCurrentStep()
        );

        // Wait another 1.5 seconds
        sleep(1500);

        // 8. Query again
        System.out.println(
                "Current mission step: "
                        + workflow.getCurrentStep()
        );

        // Wait for workflow to finish
        sleep(3000);

        // 9. Final query
        System.out.println(
                "Final mission step: "
                        + workflow.getCurrentStep()
        );

        System.exit(0);
    }

    private static void sleep(long milliseconds) {
        try {
            Thread.sleep(milliseconds);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}