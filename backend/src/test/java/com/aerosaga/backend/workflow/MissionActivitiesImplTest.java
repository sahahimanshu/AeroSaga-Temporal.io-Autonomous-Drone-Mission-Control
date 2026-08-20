package com.aerosaga.backend.workflow;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class MissionActivitiesImplTest {

    private final MissionActivitiesImpl activities = new MissionActivitiesImpl();

    @Test
    void takeoffReturnsCompletionForDrone() {
        assertEquals("Takeoff completed for DR-001", activities.takeoff("DR-001"));
    }

    @Test
    void navigateToWaypointReturnsCompletionForDroneAndWaypoint() {
        assertEquals(
                "Navigation to Sector-A completed for DR-001",
                activities.navigateToWaypoint("DR-001", "Sector-A"));
    }

    @Test
    void dropPackageReturnsCompletionForDrone() {
        assertEquals("Package dropped by DR-001", activities.dropPackage("DR-001"));
    }

    @Test
    void returnToBaseReturnsCompletionForDrone() {
        assertEquals("Drone DR-001 returned to base", activities.returnToBase("DR-001"));
    }
}