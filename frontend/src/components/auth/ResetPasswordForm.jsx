import { useState, useEffect } from "react";
import InputField from "../common/InputField";
import OtpBox from "../common/OtpBox";
import DecorativeLeaves from "../common/DecorativeLeaves";
import { PhoneIcon, LockIcon, InfoIcon, CheckCircleIcon } from "../common/Icons";
import { sendOtp, verifyOtp, resetPassword } from "../../api/auth";
import "./AuthForms.css";

function ResetPasswordForm({ onBackToLogin }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [simulatedOtpNotice, setSimulatedOtpNotice] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!otpSent || countdown === 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [otpSent, countdown]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setResetError("");
    setOtpError("");

    if (phoneNumber.length !== 10) {
      setOtpError("Mobile number must contain exactly 10 numeric digits.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await sendOtp(phoneNumber, "reset_password");
      setOtpSent(true);
      setOtp("");
      setOtpVerified(false);
      setCountdown(60);
      if (res.devOtp) {
        setSimulatedOtpNotice(`Dev OTP: ${res.devOtp}`);
        setOtp(res.devOtp);
      }
    } catch (err) {
      setOtpError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (!otp || otp.length < 4) {
      setOtpError("Please enter the 4-digit OTP.");
      return;
    }

    setIsSubmitting(true);
    try {
      await verifyOtp(phoneNumber, otp, "reset_password");
      setOtpVerified(true);
      setOtpError("");
      setSimulatedOtpNotice("");
    } catch (err) {
      setOtpError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    setOtp("");
    setOtpError("");

    try {
      const res = await sendOtp(phoneNumber, "reset_password");
      setCountdown(60);
      if (res.devOtp) {
        setSimulatedOtpNotice(`Dev OTP: ${res.devOtp}`);
        setOtp(res.devOtp);
      }
    } catch (err) {
      setOtpError(err.message);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setResetError("");

    if (newPassword.length < 6) {
      setResetError("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setResetError("Passwords do not match. Please enter the same password in both fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await resetPassword({
        mobileNumber: phoneNumber,
        newPassword,
        otp,
      });

      setResetSuccess(res.message || "Password reset successfully.");
    } catch (err) {
      setResetError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="reset-password-wrapper">
      <div className="portal-pill">
        {otpVerified ? "RESET PASSWORD" : "PASSWORD RESET"}
      </div>

      <button type="button" className="auth-back-link" onClick={onBackToLogin}>
        &larr; Back to Login
      </button>

      {simulatedOtpNotice && (
        <div className="auth-notice-banner" role="status">
          <InfoIcon size={16} />
          <span>{simulatedOtpNotice}</span>
        </div>
      )}

      {!otpVerified ? (
        <form onSubmit={handleSendOtp}>
          <InputField
            id="reset-phone"
            label="MOBILE NUMBER*"
            type="tel"
            inputMode="numeric"
            maxLength={10}
            placeholder="Enter your registered mobile number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
            required
            icon={<PhoneIcon size={17} />}
            error={otpError && !otpSent ? otpError : ""}
          />

          {!otpSent && (
            <button type="submit" className="auth-primary-btn" disabled={isSubmitting}>
              {isSubmitting ? "SENDING..." : "SEND OTP"}
              <span aria-hidden="true">&rarr;</span>
            </button>
          )}

          {otpSent && (
            <OtpBox
              otp={otp}
              setOtp={setOtp}
              countdown={countdown}
              onVerify={handleOtpSubmit}
              onResend={handleResendOtp}
              error={otpError}
              loading={isSubmitting}
            />
          )}
        </form>
      ) : (
        <form onSubmit={handleResetPasswordSubmit}>
          <InputField
            id="reset-new-password"
            label="NEW PASSWORD*"
            placeholder="Enter new password (min 6 chars)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            isPassword
            icon={<LockIcon size={17} />}
          />

          <InputField
            id="reset-confirm-password"
            label="CONFIRM PASSWORD*"
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            isPassword
            icon={<LockIcon size={17} />}
            error={resetError}
          />

          <button type="submit" className="auth-primary-btn" disabled={isSubmitting}>
            {isSubmitting ? "UPDATING..." : "RESET PASSWORD"}
            <span aria-hidden="true">&rarr;</span>
          </button>

          {resetSuccess && (
            <div className="auth-success-box">
              <span className="auth-success-icon" aria-hidden="true">
                <CheckCircleIcon size={20} />
              </span>
              <div>
                <p>{resetSuccess}</p>
                <button
                  type="button"
                  className="auth-link-btn"
                  style={{ marginTop: "8px", display: "inline-block" }}
                  onClick={onBackToLogin}
                >
                  Go to Login &rarr;
                </button>
              </div>
            </div>
          )}
        </form>
      )}

      <DecorativeLeaves style={{ marginTop: "24px" }} />
    </div>
  );
}

export default ResetPasswordForm;
