package com.aerosaga.workflow;

import com.aerosaga.activity.DropPackageActivity;
import com.aerosaga.activity.ReturnToBaseActivity;
import com.aerosaga.activity.TakeoffActivity;

import io.temporal.activity.ActivityOptions;
import io.temporal.common.RetryOptions;
import io.temporal.workflow.Async;
import io.temporal.workflow.Promise;
import io.temporal.workflow.Workflow;

import java.time.Duration;
import java.util.List;

public class MissionSagaWorkflowImpl implements MissionSagaWorkflow {

    private String missionState = "CREATED";

    
    private boolean abortRequested = false;

    private final TakeoffActivity takeoffActivity =
            Workflow.newActivityStub(
                    TakeoffActivity.class,
                    ActivityOptions.newBuilder()
                            .setStartToCloseTimeout(Duration.ofMinutes(1))
                            .build()
            );

    private final DropPackageActivity dropPackageActivity =
            Workflow.newActivityStub(
                    DropPackageActivity.class,
                    ActivityOptions.newBuilder()
                            .setStartToCloseTimeout(Duration.ofMinutes(1))
                            .setRetryOptions(
                                    RetryOptions.newBuilder()
                                            .setMaximumAttempts(1)
                                            .build()
                            )
                            .build()
            );

    private final ReturnToBaseActivity returnToBaseActivity =
            Workflow.newActivityStub(
                    ReturnToBaseActivity.class,
                    ActivityOptions.newBuilder()
                            .setStartToCloseTimeout(Duration.ofMinutes(1))
                            .build()
            );

    @Override
    public String executeMission(List<String> droneIds) {

        
        missionState = "TAKEOFF";

        System.out.println("🚁 Mission State: TAKEOFF");

        List<Promise<String>> takeoffPromises = droneIds.stream()
                .map(droneId ->
                        Async.function(
                                () -> takeoffActivity.takeoff(droneId)
                        )
                )
                .toList();

        Promise.allOf(takeoffPromises).get();

     
        if (abortRequested) {
            return handleEmergencyAbort();
        }

        Workflow.sleep(Duration.ofSeconds(60));

        
        if (abortRequested) {
            return handleEmergencyAbort();
        }

        
        missionState = "ACTIVE";

        System.out.println("🛰️ Mission State: ACTIVE");

       
        Workflow.sleep(Duration.ofSeconds(5));

        
        if (abortRequested) {
            return handleEmergencyAbort();
        }

        try {

            

            missionState = "DROP_PACKAGE";

            System.out.println("📦 Mission State: DROP_PACKAGE");

            dropPackageActivity.dropPackage();

            
            if (abortRequested) {
                return handleEmergencyAbort();
            }

            Workflow.sleep(Duration.ofSeconds(60));

            if (abortRequested) {
                return handleEmergencyAbort();
            }

            
            missionState = "COMPLETED";

            System.out.println("✅ Mission State: COMPLETED");

            return "Mission completed successfully for "
                    + droneIds.size()
                    + " drones.";

        } catch (Exception e) {

      
            missionState = "RETURNING_TO_BASE";

            System.out.println(
                    "⚠️ Package drop failed. Starting compensation..."
            );

            System.out.println(
                    "🚁 Mission State: RETURNING_TO_BASE"
            );

            returnToBaseActivity.returnToBase();

            Workflow.sleep(Duration.ofSeconds(60));

            missionState = "COMPLETED";

            System.out.println(
                    "✅ Mission State: COMPLETED"
            );

            return "Drop package failed. Drone returned to base.";
        }
    }


    @Override
    public void emergencyAbort() {

        System.out.println(
                "🚨 EMERGENCY ABORT SIGNAL RECEIVED!"
        );

        abortRequested = true;

        missionState = "ABORT_REQUESTED";

        System.out.println(
                "⚠️ Mission State: ABORT_REQUESTED"
        );
    }


    private String handleEmergencyAbort() {

        missionState = "RETURNING_TO_BASE";

        System.out.println(
                "🚨 Emergency Abort confirmed."
        );

        System.out.println(
                "🚁 Mission State: RETURNING_TO_BASE"
        );

        returnToBaseActivity.returnToBase();

        missionState = "ABORTED";

        System.out.println(
                "🛑 Mission State: ABORTED"
        );

        return "Mission emergency aborted. Drone returned to base.";
    }

    

    @Override
    public String getMissionState() {
        return missionState;
    }
}