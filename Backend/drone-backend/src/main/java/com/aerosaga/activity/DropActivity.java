package com.aerosaga.activity;

import io.temporal.activity.ActivityInterface;
import io.temporal.activity.ActivityMethod;

@ActivityInterface
public interface DropActivity {

    @ActivityMethod
    String drop(String droneId);
}
