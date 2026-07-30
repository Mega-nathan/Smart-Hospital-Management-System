package com.hms.hospitalManagementSystem.doctor.dto;

import jakarta.validation.constraints.NotBlank;

public class AvailabilitySlotDto {
    @NotBlank(message = "Day of week is required")
    private String dayOfWeek;
    
    @NotBlank(message = "Start time is required")
    private String startTime;
    
    @NotBlank(message = "End time is required")
    private String endTime;

    public AvailabilitySlotDto() {
    }

    public AvailabilitySlotDto(String dayOfWeek, String startTime, String endTime) {
        this.dayOfWeek = dayOfWeek;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public String getDayOfWeek() {
        return dayOfWeek;
    }

    public void setDayOfWeek(String dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }
}
