package com.hms.hospitalManagementSystem.common.email;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOtpEmail(String toEmail, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("no-reply@hospital.com");
            message.setTo(toEmail);
            message.setSubject("HMS Portal - Appointment Booking Verification Code");
            message.setText("Dear Patient,\n\n" +
                    "Thank you for choosing HMS. Your email verification code for booking an appointment is:\n\n" +
                    otp + "\n\n" +
                    "This code will expire in 5 minutes. Please do not share it with anyone.\n\n" +
                    "Warm regards,\n" +
                    "Hospital Management System");
            mailSender.send(message);
            System.out.println("[SMTP] OTP email successfully sent to: " + toEmail);
        } catch (Exception e) {
            System.err.println("[SMTP FAILED] Could not send email via SMTP: " + e.getMessage());
            System.out.println("\n=================================================");
            System.out.println("[SMTP FALLBACK] OTP CODE FOR EMAIL: " + toEmail);
            System.out.println("[SMTP FALLBACK] OTP: " + otp);
            System.out.println("=================================================\n");
        }
    }

    public void sendAppointmentConfirmationEmail(
            com.hms.hospitalManagementSystem.appointment.model.Appointment appointment) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("no-reply@hospital.com");
            message.setTo(appointment.getPatientEmail());
            message.setSubject("Appointment Confirmed - HMS Portal");

            String doctorName = appointment.getDoctor() != null ? appointment.getDoctor().getFullName()
                    : "Assigned Practitioner";
            String specialization = appointment.getDoctor() != null ? appointment.getDoctor().getSpecialization() : "";

            message.setText("Dear " + appointment.getPatientName() + ",\n\n" +
                    "We are pleased to inform you that your appointment has been confirmed.\n\n" +
                    "Appointment Details:\n" +
                    "- Doctor: " + doctorName
                    + (specialization == null || specialization.isEmpty() ? "" : " (" + specialization + ")") + "\n" +
                    "- Date: " + appointment.getAppointmentDate() + "\n" +
                    "- Time Slot: " + appointment.getTimeSlot() + "\n" +
                    "- Consultation Mode: " + appointment.getConsultationType() + "\n" +
                    (appointment.getNotes() == null || appointment.getNotes().isEmpty() ? ""
                            : "- Notes: " + appointment.getNotes() + "\n")
                    + "\n" +
                    "Please arrive 15 minutes before your scheduled slot.\n\n" +
                    "Thank you for choosing Hospital Management System.\n\n" +
                    "Warm regards,\n" +
                    "Hospital Management System");
            mailSender.send(message);
            System.out.println(
                    "[SMTP] Appointment confirmation email successfully sent to: " + appointment.getPatientEmail());
        } catch (Exception e) {
            System.err.println("[SMTP FAILED] Could not send confirmation email: " + e.getMessage());
        }
    }
}
