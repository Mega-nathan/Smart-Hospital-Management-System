package com.hms.hospitalManagementSystem.department.dto;

import java.time.LocalDateTime;

public class PatientBedHistoryResponse {

    private Long id;
    private String patientId;
    private String patientName;
    private String bedCode;
    private String departmentName;
    private LocalDateTime admissionDateTime;
    private LocalDateTime dischargeDateTime;

    public PatientBedHistoryResponse() {
    }

    public PatientBedHistoryResponse(Long id, String patientId, String patientName, String bedCode,
                                     String departmentName, LocalDateTime admissionDateTime, LocalDateTime dischargeDateTime) {
        this.id = id;
        this.patientId = patientId;
        this.patientName = patientName;
        this.bedCode = bedCode;
        this.departmentName = departmentName;
        this.admissionDateTime = admissionDateTime;
        this.dischargeDateTime = dischargeDateTime;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public String getBedCode() {
        return bedCode;
    }

    public void setBedCode(String bedCode) {
        this.bedCode = bedCode;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public LocalDateTime getAdmissionDateTime() {
        return admissionDateTime;
    }

    public void setAdmissionDateTime(LocalDateTime admissionDateTime) {
        this.admissionDateTime = admissionDateTime;
    }

    public LocalDateTime getDischargeDateTime() {
        return dischargeDateTime;
    }

    public void setDischargeDateTime(LocalDateTime dischargeDateTime) {
        this.dischargeDateTime = dischargeDateTime;
    }
}
