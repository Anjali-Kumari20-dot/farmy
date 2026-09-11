import React from "react";
import { KeyIcon } from "./Icons";
import "./OtpBox.css";

function OtpBox({
  otp,
  setOtp,
  countdown,
  onVerify,
  onResend,
  error = "",
  loading = false,
}) {
  return (
    <div className="otp-container">
      <div className="otp-top-bar">
        <span className="otp-pill">OTP VERIFICATION</span>
        <span className="otp-countdown">
          {countdown > 0 ? `00:${String(countdown).padStart(2, "0")}` : "00:00"}
        </span>
      </div>

      <p className="otp-instruction">
        Enter the 4-digit code sent to your mobile number.
      </p>

      <div className="otp-input-wrap">
        <label htmlFor="otp-input" className="otp-label">
          ENTER OTP*
        </label>
        <div className={`otp-field-box ${error ? "has-error" : ""}`}>
          <span className="otp-icon" aria-hidden="true">
            <KeyIcon size={16} />
          </span>
          <input
            id="otp-input"
            type="text"
            inputMode="numeric"
            maxLength={4}
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
            required
            className="otp-control"
          />
        </div>
      </div>

      {error && <p className="otp-error-msg">{error}</p>}

      <button
        type="button"
        className="otp-verify-btn"
        onClick={onVerify}
        disabled={loading}
      >
        {loading ? "VERIFYING..." : "VERIFY OTP"}
      </button>

      <button
        type="button"
        className="otp-resend-btn"
        onClick={onResend}
        disabled={countdown > 0 || loading}
      >
        {countdown > 0 ? "Resend OTP in 1 minute" : "Resend OTP"}
      </button>
    </div>
  );
}

export default OtpBox;
