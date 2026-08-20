package com.aerosaga.websocket;
import java.util.Random;
public class TelemetrySimulator {

    private static final Random random = new Random();
    private double latitude = 22.5726;
    private double longitude = 88.3639;
    private int battery = 100;

    public void start() {
        System.out.println("🚁 Telemetry simulator started!");
        while(true){
            latitude += (random.nextDouble()-0.5)*0.001;
            longitude += (random.nextDouble()-0.5)*0.001;

            battery--;
            if(battery <= 0) {
                battery =100;

            }
            System.out.println(
                "Drone M-101 | Lat: "+ latitude + " | Lon: " + longitude + "| Battery:"+battery+"%"
            );
            try {
                Thread.sleep(2000);
            }
            catch(InterruptedException e){
                Thread.currentThread().interrupt();
                break;
            }
        } 
    }
    public static void main (String [] args) {
        new TelemetrySimulator().start();
    }
}