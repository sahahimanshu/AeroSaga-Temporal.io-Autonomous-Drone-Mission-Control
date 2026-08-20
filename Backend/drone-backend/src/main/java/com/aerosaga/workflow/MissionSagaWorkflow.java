package com.aerosaga.workflow;
import io.temporal.workflow.QueryMethod;

import io.temporal.workflow.WorkflowInterface;
import io.temporal.workflow.WorkflowMethod;

import java.util.List;

@WorkflowInterface
public interface MissionSagaWorkflow {

    @WorkflowMethod
    String executeMission(List<String> droneIds);
    @QueryMethod
       String getMissionState();
}
