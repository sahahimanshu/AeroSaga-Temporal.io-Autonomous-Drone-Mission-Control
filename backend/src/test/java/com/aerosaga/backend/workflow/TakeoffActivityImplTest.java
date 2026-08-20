package com.aerosaga.backend.workflow;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class TakeoffActivityImplTest {

    private final TakeoffActivityImpl activity = new TakeoffActivityImpl();

    @Test
    void performTakeoffReturnsCompletionForDrone() {
        assertEquals("Takeoff completed for DR-001", activity.performTakeoff("DR-001"));
    }
}