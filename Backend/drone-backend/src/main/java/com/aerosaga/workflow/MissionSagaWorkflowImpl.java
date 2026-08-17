package com.aerosaga.workflow;

import com.aerosaga.activity.TakeoffActivity;
import io.temporal.activity.ActivityOptions;
import io.temporal.workflow.Async;
import io.temporal.workflow.Promise;
import io.temporal.workflow.Workflow;

import java.time.Duration;
import java.util.List;

public class MissionSagaWorkflowImpl implements MissionSagaWorkflow {

    private final TakeoffActivity takeoffActivity =
            Workflow.newActivityStub(
                    TakeoffActivity.class,
                    ActivityOptions.newBuilder()
                            .setStartToCloseTimeout(Duration.ofMinutes(1))
                            .build()
            );

    @Override
    public String executeMission(List<String> droneIds) {

        List<Promise<String>> takeoffPromises = droneIds.stream()
                .map(droneId ->
                        Async.function(
                                () -> takeoffActivity.takeoff(droneId)
                        )
                )
                .toList();

        Promise.allOf(takeoffPromises).get();

        return "Mission completed successfully for "
                + droneIds.size()
                + " drones.";
    }
}
