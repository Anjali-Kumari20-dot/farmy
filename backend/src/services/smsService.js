const https = require("https");
const twilio = require("twilio");

/* SMS service: twilio */
class SmsService {
  constructor() {
    this.provider = (process.env.SMS_PROVIDER || "mock").toLowerCase();
    this.fast2smsApiKey = process.env.FAST2SMS_API_KEY;
    this.twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
    this.twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    this.twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
  }

  /**
   * Send an OTP SMS for registration or password reset
   */
  async sendOtpSms(mobileNumber, otp, purpose = "registration") {
    const actionText =
      purpose === "reset_password"
        ? "password reset"
        : "farmer account registration";
    const message = `Your Farmy verification code is: ${otp}. Valid for 5 minutes for ${actionText}. Do not share this OTP with anyone.`;

    return this._dispatchSms(mobileNumber, message, { type: "OTP", otp });
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
    if (
      this.provider === "twilio" &&
      this.twilioAccountSid &&
      this.twilioAuthToken
    ) {
      return this._sendViaTwilio(cleanNumber, message);
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
  _sendViaTwilio(mobileNumber, message) {
    return new Promise((resolve) => {
      const formattedTo = mobileNumber.startsWith("+")
        ? mobileNumber
        : `+91${mobileNumber}`;
      const postData = new URLSearchParams({
        From: this.twilioPhoneNumber,
        To: formattedTo,
        Body: message,
      }).toString();

      const auth = Buffer.from(
        `${this.twilioAccountSid}:${this.twilioAuthToken}`,
      ).toString("base64");

      const options = {
        hostname: "api.twilio.com",
        path: `/2010-04-01/Accounts/${this.twilioAccountSid}/Messages.json`,
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(postData),
        },
      };

      const req = https.request(options, (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          try {
            const parsed = JSON.parse(body);
            if (parsed.sid) {
              console.log(
                `[Twilio] Dispatched to ${formattedTo}, SID: ${parsed.sid}`,
              );
              resolve({ success: true, provider: "twilio", sid: parsed.sid });
            } else {
              console.warn(`[Twilio Warning] ${parsed.message || body}`);
              resolve({
                success: false,
                provider: "twilio",
                error: parsed.message,
              });
            }
          } catch (e) {
            resolve({ success: false, provider: "twilio", raw: body });
          }
        });
      });

      req.on("error", (err) => {
        console.error("[Twilio Error]", err.message);
        resolve({ success: false, provider: "twilio", error: err.message });
      });

      req.write(postData);
      req.end();
    });
  }
}

const smsService = new SmsService();

module.exports = smsService;
