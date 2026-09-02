package com.aerosaga.backend.workflow;

public class MissionActivitiesImpl implements MissionActivities {

    private boolean simulateFailures = false;

    public void setSimulateFailures(boolean simulateFailures) {
        this.simulateFailures = simulateFailures;
    }

    @Override
    public String takeoff(String droneId) {
        System.out.println("Drone " + droneId + " is taking off...");
        simulateDelay();
        System.out.println("Drone " + droneId + " has taken off.");
        return "Takeoff completed for " + droneId;
    }

    @Override
    public String navigateToWaypoint(String droneId, String waypoint) {
        System.out.println("Drone " + droneId + " navigating to " + waypoint + "...");
        simulateDelay();
        System.out.println("Drone " + droneId + " reached " + waypoint + ".");
        return "Navigation to " + waypoint + " completed for " + droneId;
    }

    @Override
    public String dropPackage(String droneId) {
        System.out.println("Drone " + droneId + " dropping package...");
        simulateDelay();

        if (simulateFailures && Math.random() < 0.3) {
            System.out.println("Drone " + droneId + " FAILED to drop package!");
            throw new RuntimeException("Package drop failed for drone " + droneId);
        }

        System.out.println("Drone " + droneId + " package dropped.");
        return "Package dropped by " + droneId;
    }

    @Override
    public String returnToBase(String droneId) {
        System.out.println("Drone " + droneId + " returning to base...");
        simulateDelay();
        System.out.println("Drone " + droneId + " returned to base.");
        return "Drone " + droneId + " returned to base";
    }

    private void simulateDelay() {
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}