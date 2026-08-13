package com.aerosaga.backend.workflow;

import io.temporal.activity.ActivityInterface;
import io.temporal.activity.ActivityMethod;

@ActivityInterface
public interface TakeoffActivity {

    @ActivityMethod
    String performTakeoff(String droneId);
}