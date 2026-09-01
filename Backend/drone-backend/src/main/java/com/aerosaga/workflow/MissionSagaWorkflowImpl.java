package com.aerosaga.workflow;

import com.aerosaga.activity.DropPackageActivity;
import com.aerosaga.activity.ReturnToBaseActivity;
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
                            .setStartToCloseTimeout(Duration.ofMinutes(1))
                            .build()
            );

private final DropPackageActivity dropPackageActivity = Workflow.newActivityStub(
  DropPackageActivity.class,
  ActivityOptions.newBuilder().setStartToCloseTimeout(Duration.ofMinutes(1)).build()
);

private final ReturnToBaseActivity returnToBaseActivity =Workflow.newActivityStub(ReturnToBaseActivity.class,ActivityOptions.newBuilder().setStartToCloseTimeout(Duration.ofMinutes(1)).build()
        
 
);

    @Override
    public String executeMission(List<String> droneIds) {

        missionState = "TAKEOFF";

        List<Promise<String>> takeoffPromises = droneIds.stream()
                .map(droneId ->
                        Async.function(
                                () -> takeoffActivity.takeoff(droneId)
                        )
                )
                .toList();

        Promise.allOf(takeoffPromises).get();

        missionState = "ACTIVE";

        try {

            missionState = "DROP_PACKAGE";

            dropPackageActivity.dropPackage();

            missionState = "COMPLETED";

            return "Mission completed successfully for "
                    + droneIds.size()
                    + " drones.";

        } catch (Exception e) {

            missionState = "RETURNING_TO_BASE";

            returnToBaseActivity.returnToBase();

            missionState = "COMPLETED";

            return "Drop package failed. Drone returned to base.";
        }
    }

    @Override
    public String getMissionState() {
        return missionState;
    }
}