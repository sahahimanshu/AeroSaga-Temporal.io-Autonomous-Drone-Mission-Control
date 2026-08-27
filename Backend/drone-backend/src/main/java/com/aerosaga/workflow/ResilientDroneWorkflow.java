package com.aerosaga.workflow;

import io.temporal.workflow.Workflow;

import java.time.Duration;

public class ResilientDroneWorkflow implements ResilientDroneWorkflowInterface {

    private String state = "STARTED";

    @Override
    public String runResilientMission() {

        state = "TAKEOFF";

        Workflow.sleep(Duration.ofMinutes(2));

        state = "MISSION_ACTIVE";

        Workflow.sleep(Duration.ofMinutes(6));

        state = "RETURNING_TO_BASE";

        Workflow.sleep(Duration.ofMinutes(2));

        state = "COMPLETED";

        return "Resilient mission completed successfully.";
    }

    @Override
    public String getState() {
        return state;
    }
}
