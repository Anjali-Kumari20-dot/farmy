const https = require("https");
const twilio = require("twilio");

/* SMS service: Twilio, Fast2SMS, or local development mock */
class SmsService {
  constructor() {
    this.provider = (process.env.SMS_PROVIDER || "mock").toLowerCase();
    this.fast2smsApiKey = process.env.FAST2SMS_API_KEY;
    // TWILIO_SID is supported for existing local configurations.
    this.twilioAccountSid = process.env.TWILIO_ACCOUNT_SID || process.env.TWILIO_SID;
    this.twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    this.twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
    this.twilioVerifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
    this.twilioClient =
      this.twilioAccountSid && this.twilioAuthToken
        ? twilio(this.twilioAccountSid, this.twilioAuthToken)
        : null;
  }

  getStatus() {
    const configured =
      this.provider === "twilio"
        ? Boolean(this.twilioClient && this.twilioVerifyServiceSid)
        : this.provider === "fast2sms"
          ? Boolean(this.fast2smsApiKey)
          : true;

    return {
      provider: this.provider,
      otpChannel: this.provider === "twilio" ? "verify" : this.provider,
      configured,
    };
  }

  usesTwilioVerify() {
    return this.provider === "twilio";
  }

  _formatIndianPhoneNumber(mobileNumber) {
    return mobileNumber.startsWith("+") ? mobileNumber : `+91${mobileNumber}`;
  }

  /**
   * Send an OTP SMS for registration or password reset
   */
  async sendOtpSms(mobileNumber, otp, purpose = "registration") {
    if (this.usesTwilioVerify()) {
      return this._startTwilioVerification(mobileNumber);
    }

    const actionText =
      purpose === "reset_password"
        ? "password reset"
        : "farmer account registration";
    const message = `Your Farmy verification code is: ${otp}. Valid for 5 minutes for ${actionText}. Do not share this OTP with anyone.`;

    return this._dispatchSms(mobileNumber, message, { type: "OTP", otp });
  }

  async verifyOtp(mobileNumber, code) {
    if (!this.usesTwilioVerify()) {
      return { success: false, error: "Twilio Verify is not the active OTP provider." };
    }

    if (!this.twilioClient || !this.twilioVerifyServiceSid) {
      return {
        success: false,
        error: "Twilio Verify requires TWILIO_ACCOUNT_SID (or TWILIO_SID), TWILIO_AUTH_TOKEN, and TWILIO_VERIFY_SERVICE_SID.",
      };
    }

    try {
      const verification = await this.twilioClient.verify.v2
        .services(this.twilioVerifyServiceSid)
        .verificationChecks.create({
          to: this._formatIndianPhoneNumber(mobileNumber),
          code,
        });

      return {
        success: true,
        approved: verification.status === "approved",
        provider: "twilio-verify",
      };
    } catch (error) {
      console.error("[Twilio Verify Error]", error.message);
      return { success: false, provider: "twilio-verify", error: error.message };
    }
  }

  async _startTwilioVerification(mobileNumber) {
    if (!this.twilioClient || !this.twilioVerifyServiceSid) {
      return {
        success: false,
        provider: "twilio-verify",
        error: "Twilio Verify requires TWILIO_ACCOUNT_SID (or TWILIO_SID), TWILIO_AUTH_TOKEN, and TWILIO_VERIFY_SERVICE_SID.",
      };
    }

    try {
      const verification = await this.twilioClient.verify.v2
        .services(this.twilioVerifyServiceSid)
        .verifications.create({
          to: this._formatIndianPhoneNumber(mobileNumber),
          channel: "sms",
        });

      return {
        success: verification.status === "pending",
        provider: "twilio-verify",
        status: verification.status,
      };
    } catch (error) {
      console.error("[Twilio Verify Error]", error.message);
      return { success: false, provider: "twilio-verify", error: error.message };
    }
  }

  /**
   * send a procurement slot booking confirmation SMS
   */

  async sendSlotConfirmationSms({
    mobileNumber,
    farmerName,
    cropType,
    quantityQuintals,
    date,
    timeSlot,
    bookingId,
  }) {
    const shortRef = bookingId.toString().slice(-6).toUpperCase();
    const message = `Dear ${farmerName}, your crop procurement booking (Ref: ${shortRef}) for ${cropType} (${quantityQuintals} Quintals) is confirmed for ${date} at ${timeSlot} at the Mandi Center.`;

    return this._dispatchSms(mobileNumber, message, {
      type: "BOOKING_CONFIRMATION",
      bookingId,
    });
  }

  /**
   * Send a procurement slot cancellation SMS
   */
  async sendSlotCancellationSms({
    mobileNumber,
    farmerName,
    date,
    timeSlot,
    bookingId,
  }) {
    const shortRef = bookingId.toString().slice(-6).toUpperCase();
    const message = `Dear ${farmerName}, your procurement booking (Ref: ${shortRef}) scheduled for ${date} (${timeSlot}) has been cancelled successfully.`;

    return this._dispatchSms(mobileNumber, message, {
      type: "BOOKING_CANCELLATION",
      bookingId,
    });
  }

  /**
   * Internal dispatcher directing SMS to the configured gateway provider
   */
  async _dispatchSms(mobileNumber, message, metadata = {}) {
    const cleanNumber = mobileNumber.replace(/\D/g, "");

    // 1. Fast2SMS Provider (Common for Indian standard DLTT & Quick SMS)
    if (this.provider === "fast2sms" && this.fast2smsApiKey) {
      return this._sendViaFast2Sms(cleanNumber, message);
    }

    // 2. Twilio Provider
    if (this.provider === "twilio" && this.twilioClient && this.twilioPhoneNumber) {
      return this._sendViaTwilio(cleanNumber, message);
    }

    if (this.provider === "twilio") {
      return {
        success: false,
        provider: "twilio",
        error: "Twilio requires TWILIO_ACCOUNT_SID (or TWILIO_SID), TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER.",
      };
    }

    // 3. Fallback / Mock Dev Provider
    return this._sendViaMock(cleanNumber, message, metadata);
  }

  /**
   * Mock / Development logger
   */
  _sendViaMock(mobileNumber, message, metadata) {
    const timestamp = new Date().toISOString();
    console.log("--------------------------------------------------");
    console.log(`[SMS Gateway (${this.provider.toUpperCase()})] ${timestamp}`);
    console.log(`To: +91 ${mobileNumber}`);
    console.log(`Type: ${metadata.type || "NOTIFICATION"}`);
    console.log(`Message: "${message}"`);
    console.log("--------------------------------------------------");

    return {
      success: true,
      provider: "mock",
      recipient: mobileNumber,
      message,
      sentAt: timestamp,
    };
  }

  /**
   * Fast2SMS implementation via HTTPS POST
   */
  _sendViaFast2Sms(mobileNumber, message) {
    return new Promise((resolve, reject) => {
      const postData = JSON.stringify({
        route: "q",
        message,
        language: "english",
        flash: 0,
        numbers: mobileNumber,
      });

      const options = {
        hostname: "www.fast2sms.com",
        path: "/dev/bulkV2",
        method: "POST",
        headers: {
          authorization: this.fast2smsApiKey,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(postData),
        },
      };

      const req = https.request(options, (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          try {
            const parsed = JSON.parse(body);
            if (parsed.return) {
              console.log(`[Fast2SMS] Dispatched to +91 ${mobileNumber}`);
              resolve({ success: true, provider: "fast2sms", data: parsed });
            } else {
              console.warn(`[Fast2SMS Warning] ${parsed.message || body}`);
              resolve({
                success: false,
                provider: "fast2sms",
                error: parsed.message,
              });
            }
          } catch (e) {
            resolve({ success: false, provider: "fast2sms", raw: body });
          }
        });
      });

      req.on("error", (err) => {
        console.error("[Fast2SMS Error]", err.message);
        resolve({ success: false, provider: "fast2sms", error: err.message });
      });

      req.write(postData);
      req.end();
    });
  }

  /**
   * Twilio implementation via HTTPS Basic Auth
   */
  async _sendViaTwilio(mobileNumber, message) {
    const formattedTo = this._formatIndianPhoneNumber(mobileNumber);

    try {
      const result = await this.twilioClient.messages.create({
        from: this.twilioPhoneNumber,
        to: formattedTo,
        body: message,
      });

      console.log(`[Twilio] Dispatched to ${formattedTo}, SID: ${result.sid}`);
      return { success: true, provider: "twilio", sid: result.sid };
    } catch (error) {
      console.error("[Twilio Error]", error.message);
      return { success: false, provider: "twilio", error: error.message };
    }
  }
}

const smsService = new SmsService();

module.exports = smsService;
