package com.aerosaga.backend.workflow;

import io.temporal.workflow.WorkflowInterface;
import io.temporal.workflow.WorkflowMethod;

@WorkflowInterface
public interface MissionWorkflow {

    @WorkflowMethod
    String runMission(String droneId, String waypoint);
}