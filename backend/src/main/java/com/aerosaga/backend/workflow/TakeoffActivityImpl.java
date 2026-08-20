package com.aerosaga.backend.workflow;

public class TakeoffActivityImpl implements TakeoffActivity {

    @Override
    public String performTakeoff(String droneId) {
        System.out.println("Drone " + droneId + " is taking off...");

        // Simulate the physical takeoff action
        // Later this could call a real drone control API or hardware interface
        try {
            Thread.sleep(1000); // simulate a 1-second takeoff process
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        System.out.println("Drone " + droneId + " has taken off successfully.");
        return "Takeoff completed for " + droneId;
    }
}