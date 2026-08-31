package com.aerosaga.activity;
public class ReturnToBaseActivityImpl implements ReturnToBaseActivity {
    @Override
    public String returnToBase(){
        System.out.println("🏠 Returning to base...");
        return "Drone returned to base successfully.";
    }
}