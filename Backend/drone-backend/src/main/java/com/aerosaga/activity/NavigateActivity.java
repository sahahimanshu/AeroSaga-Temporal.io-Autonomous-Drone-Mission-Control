package com.aerosaga.activity;

import io.temporal.activity.ActivityInterface;
import io.temporal.activity.ActivityMethod;

@ActivityInterface
public interface NavigateActivity {

    @ActivityMethod
    String navigate(String droneId);
}