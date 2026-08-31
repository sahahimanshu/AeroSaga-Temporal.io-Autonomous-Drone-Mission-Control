package com.aerosaga;
import com.aerosaga.workflow.MissionSagaWorkflow;
import io.temporal.client.WorkflowClient;
import io.temporal.client.WorkflowOptions;
import io.temporal.serviceclient.WorkflowServiceStubs;

import java.util.List;
public class MissionSagaWorkflowStarter {
     public static void main(String[] args) {
        WorkflowServiceStubs service  = WorkflowServiceStubs.newLocalServiceStubs();
        WorkflowClient client = WorkflowClient.newInstance(service);
        MissionSagaWorkflow workflow = client.newWorkflowStub(MissionSagaWorkflow.class,WorkflowOptions.newBuilder().setTaskQueue("DRONE_TASK_QUEUE").setWorkflowId("SAGA-TEST-001")
    .build());

    System.out.println("Starting  Mission Saga...");
     String result = workflow.executeMission(
        List.of("M-01", "M-02", "M-03")
     );
     System.out.println("Result:" + result);
     }
     
}


