package com.aerosaga.backend.workflow;

import io.temporal.activity.ActivityOptions;
import io.temporal.workflow.Workflow;
import java.time.Duration;

public class MissionWorkflowImpl implements MissionWorkflow {

    private final MissionActivities activities = Workflow.newActivityStub(
            MissionActivities.class,
            ActivityOptions.newBuilder()
                    .setStartToCloseTimeout(Duration.ofSeconds(10))
                    .build()
    );

    @Override
    public String runMission(String droneId, String waypoint) {
        activities.takeoff(droneId);
        activities.navigateToWaypoint(droneId, waypoint);
        activities.dropPackage(droneId);
        activities.returnToBase(droneId);

        return "Mission completed for drone " + droneId;
    }
}