package com.aerosaga.backend.workflow;

import io.temporal.workflow.WorkflowInterface;
import io.temporal.workflow.WorkflowMethod;

@WorkflowInterface
public interface TakeoffWorkflow {

    @WorkflowMethod
    String takeoff(String droneId);
}