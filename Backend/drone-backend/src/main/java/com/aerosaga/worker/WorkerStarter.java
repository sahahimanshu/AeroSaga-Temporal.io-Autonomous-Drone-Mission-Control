package com.aerosaga.worker;

import com.aerosaga.activity.TakeoffActivityImpl;
import com.aerosaga.workflow.DroneTakeoffWorkflowImpl;
import com.aerosaga.workflow.MissionSagaWorkflowImpl;

import io.temporal.client.WorkflowClient;
import io.temporal.serviceclient.WorkflowServiceStubs;
import io.temporal.worker.Worker;
import io.temporal.worker.WorkerFactory;

public class WorkerStarter {

    public static final String TASK_QUEUE = "DRONE_TASK_QUEUE";

    public static void main(String[] args) {

        
        WorkflowServiceStubs service =
                WorkflowServiceStubs.newLocalServiceStubs();

        WorkflowClient client =
                WorkflowClient.newInstance(service);

        
        WorkerFactory factory =
                WorkerFactory.newInstance(client);

        Worker worker =
                factory.newWorker(TASK_QUEUE);

        worker.registerWorkflowImplementationTypes(
    DroneTakeoffWorkflowImpl.class,
    MissionSagaWorkflowImpl.class
);
        
        worker.registerActivitiesImplementations(
                new TakeoffActivityImpl()
        );

        factory.start();

        System.out.println("🚁 AeroSaga Temporal Worker started!");
        System.out.println("📡 Task Queue: " + TASK_QUEUE);
    }
}