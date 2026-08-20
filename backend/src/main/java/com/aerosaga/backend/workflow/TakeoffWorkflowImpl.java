package com.aerosaga.backend.workflow;

import io.temporal.activity.ActivityOptions;
import io.temporal.workflow.Workflow;
import java.time.Duration;

public class TakeoffWorkflowImpl implements TakeoffWorkflow {

    private final TakeoffActivity activity = Workflow.newActivityStub(
            TakeoffActivity.class,
            ActivityOptions.newBuilder()
                    .setStartToCloseTimeout(Duration.ofSeconds(10))
                    .build()
    );

    @Override
    public String takeoff(String droneId) {
        return activity.performTakeoff(droneId);
    }
}