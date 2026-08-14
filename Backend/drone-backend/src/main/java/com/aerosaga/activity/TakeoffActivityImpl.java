package com.aerosaga.activity;

public class TakeoffActivityImpl implements TakeoffActivity {

    @Override
    public String takeoff(String droneId) {

        System.out.println("🚁 Takeoff command received for drone: " + droneId);

        return "Drone " + droneId + " has successfully taken off.";
    }
}

