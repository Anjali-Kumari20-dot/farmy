import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../common/InputField";
import OtpBox from "../common/OtpBox";
import DecorativeLeaves from "../common/DecorativeLeaves";
import {
  WheatIcon,
  UserIcon,
  PhoneIcon,
  LockIcon,
  AlertCircleIcon,
  InfoIcon,
  CheckCircleIcon,
} from "../common/Icons";
import { sendOtp, verifyOtp, registerFarmer } from "../../api/auth";
import { useAuth } from "../../context/useAuth";
import "./AuthForms.css";

function RegisterForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [fullname, setFullname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordError, setPasswordError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [serverError, setServerError] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [simulatedOtpNotice, setSimulatedOtpNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!otpSent || countdown === 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [otpSent, countdown]);

  // Step 1: Submit Details & Request OTP
  const handleInitiateRegister = async (e) => {
    e.preventDefault();
    setServerError("");
    setPasswordError("");
    setPhoneError("");

    if (phoneNumber.length !== 10 || !/^\d{10}$/.test(phoneNumber)) {
      setPhoneError("Mobile number must contain exactly 10 numeric digits.");
      return;
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match. Please enter the same password in both fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await sendOtp(phoneNumber, "registration");
      setOtpSent(true);
      setOtp("");
      setOtpVerified(false);
      setOtpError("");
      setCountdown(60);

      if (res.devOtp) {
        setSimulatedOtpNotice(`Dev OTP: ${res.devOtp}`);
        setOtp(res.devOtp);
      }
    } catch (err) {
      setServerError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Verify OTP via Backend
  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 4) {
      setOtpError("Please enter the 4-digit code.");
      return;
    }

    setOtpError("");
    setIsSubmitting(true);

    try {
      await verifyOtp(phoneNumber, otp, "registration");
      setOtpVerified(true);
      setSimulatedOtpNotice("");

      // Finalize registration
      const registerRes = await registerFarmer({
        fullname,
        mobileNumber: phoneNumber,
        password,
        otp,
      });

      if (registerRes.success && registerRes.token) {
        login(registerRes.token, registerRes.farmer);
        navigate("/dashboard");
      }
    } catch (err) {
      setOtpError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (countdown > 0) return;
    setOtp("");
    setOtpError("");
    setServerError("");

    try {
      const res = await sendOtp(phoneNumber, "registration");
      setCountdown(60);
      if (res.devOtp) {
        setSimulatedOtpNotice(`Dev OTP: ${res.devOtp}`);
        setOtp(res.devOtp);
      }
    } catch (err) {
      setOtpError(err.message);
    }
  };

  return (
    <div className="register-form-wrapper">
      <div className="portal-pill">FARMER PORTAL / REGISTRATION</div>
      <div className="portal-logo-icon">
        <WheatIcon size={32} />
      </div>

      <h2 className="auth-form-title">
        CREATE<br />ACCOUNT
      </h2>

      <p className="auth-form-subtitle">
        Register as a farmer to access the crop procurement portal.
      </p>

      {serverError && (
        <div className="auth-error-banner" role="alert">
          <AlertCircleIcon size={16} />
          <span>{serverError}</span>
        </div>
      )}

      {simulatedOtpNotice && (
        <div className="auth-notice-banner" role="status">
          <InfoIcon size={16} />
          <span>{simulatedOtpNotice}</span>
        </div>
      )}

      {!otpSent && !otpVerified && (
        <form onSubmit={handleInitiateRegister}>
          <InputField
            id="register-fullname"
            label="FULL NAME*"
            placeholder="Enter your full name"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            required
            icon={<UserIcon size={17} />}
          />

          <InputField
            id="register-phone"
            label="MOBILE NUMBER*"
            type="tel"
            inputMode="numeric"
            maxLength={10}
            placeholder="Enter 10-digit mobile number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
            required
            icon={<PhoneIcon size={17} />}
            error={phoneError}
          />

          <InputField
            id="register-password"
            label="CREATE PASSWORD*"
            placeholder="Create a password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            isPassword
            icon={<LockIcon size={17} />}
          />

          <InputField
            id="register-confirm-password"
            label="CONFIRM PASSWORD*"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            isPassword
            icon={<LockIcon size={17} />}
            error={passwordError}
          />

          <button type="submit" className="auth-primary-btn" disabled={isSubmitting}>
            {isSubmitting ? "SENDING OTP..." : "REGISTER"}
            <span aria-hidden="true">&rarr;</span>
          </button>
        </form>
      )}

      {otpSent && !otpVerified && (
        <OtpBox
          otp={otp}
          setOtp={setOtp}
          countdown={countdown}
          onVerify={handleVerifyOtp}
          onResend={handleResendOtp}
          error={otpError}
          loading={isSubmitting}
        />
      )}

      {otpVerified && (
        <div className="auth-success-box">
          <span className="auth-success-icon" aria-hidden="true">
            <CheckCircleIcon size={20} />
          </span>
          <div>
            <p>Registration completed successfully.</p>
            <Link to="/dashboard" className="auth-link-btn">
              Go to Dashboard &rarr;
            </Link>
          </div>
        </div>
      )}

      <p className="auth-switch-text">
        Already have an account?
        <Link to="/login"> Login here.</Link>
      </p>

      <DecorativeLeaves className="top-leaves" />

      <div className="auth-mission-block">
        <p className="mission-tag">OUR MISSION</p>
        <h3>Smarter procurement for every farmer.</h3>
        <p>
          Farmers often face long waiting times, lack of information regarding procurement schedules,
          and uncertainty about procurement status. Our platform addresses these challenges by enabling
          farmer registration, slot booking, real-time queue management, instant notifications,
          and transparent tracking of procurement and payment updates.
        </p>
        <ul>
          <li>Farmer registration and slot booking</li>
          <li>Real-time queue management</li>
          <li>SMS and app notifications</li>
          <li>Procurement and payment status tracking</li>
          <li>Reduced congestion at procurement centres</li>
        </ul>
      </div>

      <DecorativeLeaves className="bottom-leaves" />
    </div>
  );
}

export default RegisterForm;
