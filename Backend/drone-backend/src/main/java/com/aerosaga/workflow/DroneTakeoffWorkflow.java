
    
package com.aerosaga.workflow;

import io.temporal.workflow.WorkflowInterface;
import io.temporal.workflow.WorkflowMethod;

@WorkflowInterface
public interface DroneTakeoffWorkflow {

    @WorkflowMethod
    String execute(String droneId);
}
