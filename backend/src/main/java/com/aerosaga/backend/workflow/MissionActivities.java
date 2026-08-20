package com.aerosaga.backend.workflow;

import io.temporal.activity.ActivityInterface;
import io.temporal.activity.ActivityMethod;

@ActivityInterface
public interface MissionActivities {

    @ActivityMethod
    String takeoff(String droneId);

    @ActivityMethod
    String navigateToWaypoint(String droneId, String waypoint);

    @ActivityMethod
    String dropPackage(String droneId);

    @ActivityMethod
    String returnToBase(String droneId);
}