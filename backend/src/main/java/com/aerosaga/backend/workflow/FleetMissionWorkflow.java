package com.aerosaga.backend.workflow;

import io.temporal.workflow.WorkflowInterface;
import io.temporal.workflow.WorkflowMethod;
import java.util.List;

@WorkflowInterface
public interface FleetMissionWorkflow {

    @WorkflowMethod
    String runFleetMission(List<String> droneIds, String waypoint);
}