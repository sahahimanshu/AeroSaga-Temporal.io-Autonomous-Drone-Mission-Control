package com.aerosaga.activity;

public class NavigateActivityImpl implements NavigateActivity {

    @Override
    public String navigate(String droneId) {

        System.out.println(
                "🚁 Navigation started for drone: " + droneId
        );

        // Simulate long-running navigation
        try {
            Thread.sleep(180000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Navigation interrupted", e);
        }

        System.out.println(
                "📍 Navigation completed for drone: " + droneId
        );

        return "Drone " + droneId + " reached the waypoint.";
    }
}