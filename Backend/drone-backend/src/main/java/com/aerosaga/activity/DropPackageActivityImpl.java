package com.aerosaga.activity;

public class DropPackageActivityImpl implements DropPackageActivity {

    @Override
    public String dropPackage() {

        System.out.println("📦 Dropping package...");

        return "Package dropped successfully.";
    }
}