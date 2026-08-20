package com.aerosaga.workflow;

import com.aerosaga.activity.TakeoffActivity;
import io.temporal.activity.ActivityOptions;
import io.temporal.workflow.Workflow;

import java.time.Duration;

public class DroneTakeoffWorkflowImpl implements DroneTakeoffWorkflow {

    private final TakeoffActivity takeoffActivity =
            Workflow.newActivityStub(
                    TakeoffActivity.class,
                    ActivityOptions.newBuilder()
                            .setStartToCloseTimeout(Duration.ofMinutes(1))
                            .build()
            );

    @Override
    public String execute(String droneId) {
        return takeoffActivity.takeoff(droneId);
    }
}