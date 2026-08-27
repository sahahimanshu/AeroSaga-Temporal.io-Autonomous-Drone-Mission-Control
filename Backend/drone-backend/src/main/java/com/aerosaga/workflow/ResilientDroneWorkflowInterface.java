package com.aerosaga.workflow;

import io.temporal.workflow.QueryMethod;
import io.temporal.workflow.WorkflowInterface;
import io.temporal.workflow.WorkflowMethod;

@WorkflowInterface
public interface ResilientDroneWorkflowInterface {

    @WorkflowMethod
    String runResilientMission();

    @QueryMethod
    String getState();
}