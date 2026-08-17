package com.aerosaga.backend.workflow;

import io.temporal.workflow.Async;
import io.temporal.workflow.Promise;
import io.temporal.workflow.Workflow;
import io.temporal.workflow.ChildWorkflowOptions;

import java.util.ArrayList;
import java.util.List;

public class FleetMissionWorkflowImpl implements FleetMissionWorkflow {

    @Override
    public String runFleetMission(List<String> droneIds, String waypoint) {

        List<Promise<String>> missionPromises = new ArrayList<>();

        for (String droneId : droneIds) {
            MissionWorkflow child = Workflow.newChildWorkflowStub(
                    MissionWorkflow.class,
                    ChildWorkflowOptions.newBuilder()
                            .setWorkflowId("mission-" + droneId)
                            .build()
            );

            // Start each child mission asynchronously
            Promise<String> promise = Async.function(child::runMission, droneId, waypoint);
            missionPromises.add(promise);
        }

        // Wait for ALL drone missions to complete
        Promise.allOf(missionPromises).get();

        return "Fleet mission completed for " + droneIds.size() + " drones";
    }
}