package com.aerosaga.workflow;

import com.aerosaga.activity.TakeoffActivity;
import io.temporal.activity.ActivityOptions;
import io.temporal.workflow.Async;
import io.temporal.workflow.Promise;
import io.temporal.workflow.Workflow;

import java.time.Duration;
import java.util.List;

public class MissionSagaWorkflowImpl implements MissionSagaWorkflow {

    private String missionState = "CREATED";

    private final TakeoffActivity takeoffActivity =
            Workflow.newActivityStub(
                    TakeoffActivity.class,
                    ActivityOptions.newBuilder()
                            .setStartToCloseTimeout(Duration.ofMinutes(2))
                            .build()
            );

    @Override
    public String executeMission(List<String> droneIds) {

        // STEP 1: TAKEOFF
        missionState = "TAKEOFF";

        List<Promise<String>> takeoffPromises = droneIds.stream()
                .map(droneId ->
                        Async.function(
                                () -> takeoffActivity.takeoff(droneId)
                        )
                )
                .toList();

        Promise.allOf(takeoffPromises).get();

        // STEP 2: LONG RUNNING MISSION
        missionState = "NAVIGATING";

        Workflow.sleep(Duration.ofMinutes(3));

        // STEP 3: DROP PACKAGE
        missionState = "DROPPING";

        Workflow.sleep(Duration.ofMinutes(2));

        // STEP 4: RETURN TO BASE
        missionState = "RETURNING";

        Workflow.sleep(Duration.ofMinutes(2));

        // COMPLETED
        missionState = "COMPLETED";

        return "Mission completed successfully for "
                + droneIds.size()
                + " drones.";
    }

    @Override
    public String getMissionState() {
        return missionState;
    }
}