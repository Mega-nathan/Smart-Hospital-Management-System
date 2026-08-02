package com.hms.hospitalManagementSystem.department.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "patient_bed_history")
public class PatientBedHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String patientId;

    @Column(nullable = false)
    private String patientName;

    @Column(nullable = false)
    private String bedCode;

    @Column(nullable = false)
    private String departmentName;

    @Column(nullable = false)
    private LocalDateTime admissionDateTime;

    @Column(nullable = false)
    private LocalDateTime dischargeDateTime;

    public PatientBedHistory() {
    }

    public PatientBedHistory(Long id, String patientId, String patientName, String bedCode,
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

    public static PatientBedHistoryBuilder builder() {
        return new PatientBedHistoryBuilder();
    }

    public static class PatientBedHistoryBuilder {
        private Long id;
        private String patientId;
        private String patientName;
        private String bedCode;
        private String departmentName;
        private LocalDateTime admissionDateTime;
        private LocalDateTime dischargeDateTime;

        PatientBedHistoryBuilder() {
        }

        public PatientBedHistoryBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public PatientBedHistoryBuilder patientId(String patientId) {
            this.patientId = patientId;
            return this;
        }

        public PatientBedHistoryBuilder patientName(String patientName) {
            this.patientName = patientName;
            return this;
        }

        public PatientBedHistoryBuilder bedCode(String bedCode) {
            this.bedCode = bedCode;
            return this;
        }

        public PatientBedHistoryBuilder departmentName(String departmentName) {
            this.departmentName = departmentName;
            return this;
        }

        public PatientBedHistoryBuilder admissionDateTime(LocalDateTime admissionDateTime) {
            this.admissionDateTime = admissionDateTime;
            return this;
        }

        public PatientBedHistoryBuilder dischargeDateTime(LocalDateTime dischargeDateTime) {
            this.dischargeDateTime = dischargeDateTime;
            return this;
        }

        public PatientBedHistory build() {
            return new PatientBedHistory(id, patientId, patientName, bedCode, departmentName, admissionDateTime, dischargeDateTime);
        }
    }
}
