const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  mobileNumber: {
    type: String,
    required: true,
    index: true,
    match: [/^\d{10}$/, "Mobile number must be 10 digits"],
  },
  otp: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    enum: ["registration", "login", "reset_password"],
    default: "registration",
  },
  attempts: {
    type: Number,
    default: 0,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    // Document expires and is automatically purged from MongoDB after 5 minutes (300 seconds)
    expires: 300,
  },
});

module.exports = mongoose.model("Otp", otpSchema);
