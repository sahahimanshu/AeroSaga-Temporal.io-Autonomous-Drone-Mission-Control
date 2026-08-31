package com.aerosaga;

import com.aerosaga.workflow.ResilientDroneWorkflowInterface;

import io.temporal.client.WorkflowClient;
import io.temporal.client.WorkflowOptions;
import io.temporal.serviceclient.WorkflowServiceStubs;

public class ResilientDroneWorkflowStarter {

    public static void main(String[] args) {

        WorkflowServiceStubs service =
                WorkflowServiceStubs.newLocalServiceStubs();

        WorkflowClient client =
                WorkflowClient.newInstance(service);

        ResilientDroneWorkflowInterface workflow =
                client.newWorkflowStub(
                        ResilientDroneWorkflowInterface.class,
                        WorkflowOptions.newBuilder()
                                .setTaskQueue("DRONE_TASK_QUEUE")
                                .setWorkflowId("resiliency-test-004")
                                .build()
                );

        System.out.println("Starting resiliency test workflow...");

        WorkflowClient.start(
                workflow::runResilientMission
        );

        System.out.println("Workflow started.");
        System.out.println("Workflow ID: resiliency-test-004");
    }
}