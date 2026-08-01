package com.hms.hospitalManagementSystem.appointment.dto;

import java.time.LocalDate;

public class AppointmentRequest {

    private String patientName;
    private String patientPhone;
    private String patientEmail;
    private LocalDate appointmentDate;
    private String timeSlot;
    private String consultationType;
    private String notes;
    private Long doctorId;

    public AppointmentRequest() {
    }

    public AppointmentRequest(String patientName, String patientPhone, String patientEmail,
                              LocalDate appointmentDate, String timeSlot, String consultationType,
                              String notes, Long doctorId) {
        this.patientName = patientName;
        this.patientPhone = patientPhone;
        this.patientEmail = patientEmail;
        this.appointmentDate = appointmentDate;
        this.timeSlot = timeSlot;
        this.consultationType = consultationType;
        this.notes = notes;
        this.doctorId = doctorId;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public String getPatientPhone() {
        return patientPhone;
    }

    public void setPatientPhone(String patientPhone) {
        this.patientPhone = patientPhone;
    }

    public String getPatientEmail() {
        return patientEmail;
    }

    public void setPatientEmail(String patientEmail) {
        this.patientEmail = patientEmail;
    }

    public LocalDate getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(LocalDate appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public String getTimeSlot() {
        return timeSlot;
    }

    public void setTimeSlot(String timeSlot) {
        this.timeSlot = timeSlot;
    }

    public String getConsultationType() {
        return consultationType;
    }

    public void setConsultationType(String consultationType) {
        this.consultationType = consultationType;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Long getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Long doctorId) {
        this.doctorId = doctorId;
    }
}
