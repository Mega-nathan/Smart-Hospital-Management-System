package com.hms.hospitalManagementSystem.common.email;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    private static class OtpData {
        private final String code;
        private final LocalDateTime expiryTime;

        public OtpData(String code, LocalDateTime expiryTime) {
            this.code = code;
            this.expiryTime = expiryTime;
        }

        public String getCode() {
            return code;
        }

        public LocalDateTime getExpiryTime() {
            return expiryTime;
        }
    }

    private final ConcurrentHashMap<String, OtpData> otpMap = new ConcurrentHashMap<>();
    private final Random random = new Random();

    public String generateOtp(String email) {
        String code = String.format("%04d", random.nextInt(10000));
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(5);
        otpMap.put(email.toLowerCase(), new OtpData(code, expiry));
        return code;
    }

    public boolean verifyOtp(String email, String otp) {
        if (email == null || otp == null) {
            return false;
        }
        String key = email.toLowerCase().trim();
        OtpData data = otpMap.get(key);
        if (data == null) {
            return false;
        }
        if (LocalDateTime.now().isAfter(data.getExpiryTime())) {
            otpMap.remove(key); // Remove expired OTP
            return false;
        }
        boolean isValid = data.getCode().equals(otp.trim());
        if (isValid) {
            otpMap.remove(key); // Consume the OTP on successful verification
        }
        return isValid;
    }
}
