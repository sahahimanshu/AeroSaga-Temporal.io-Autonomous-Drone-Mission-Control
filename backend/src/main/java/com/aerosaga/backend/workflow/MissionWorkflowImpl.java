package com.aerosaga.backend.workflow;

import io.temporal.activity.ActivityOptions;
import io.temporal.workflow.Workflow;
import java.time.Duration;

public class MissionWorkflowImpl implements MissionWorkflow {

    private final MissionActivities activities = Workflow.newActivityStub(
            MissionActivities.class,
            ActivityOptions.newBuilder()
                    .setStartToCloseTimeout(Duration.ofSeconds(10))
                    .setRetryOptions(
                            io.temporal.common.RetryOptions.newBuilder()
                                    .setMaximumAttempts(2)
                                    .build()
                    )
                    .build()
    );
    private String currentStep = "STARTING";

    @Override
    public String runMission(String droneId, String waypoint) {
        currentStep = "TAKEOFF";
        activities.takeoff(droneId);

        currentStep = "NAVIGATING";
        activities.navigateToWaypoint(droneId, waypoint);

        currentStep = "DROPPING";
        try {
            activities.dropPackage(droneId);
        } catch (Exception e) {
            currentStep = "COMPENSATING";
            System.out.println(
                "Drop failed for drone " + droneId + ". Triggering compensation: Return to Base."
            );
            activities.returnToBase(droneId);
            currentStep = "ABORTED_RETURNED";
            return "Mission ABORTED for drone " + droneId + " — package drop failed, drone safely returned to base.";
        }

        currentStep = "RETURNING";
        activities.returnToBase(droneId);
        currentStep = "COMPLETED";
        return "Mission completed for drone " + droneId;
    }

    @Override
    public String getCurrentStep() {
        return currentStep;
    }
}