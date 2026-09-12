const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { encryptAadhaar, getAadhaarFingerprint, getAadhaarLast4, validateAadhaar } = require("../utils/identity");

const farmerSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Full name must be at least 2 characters"],
      maxlength: [100, "Full name cannot exceed 100 characters"],
    },
    mobileNumber: {
      type: String,
      required: [true, "Mobile number is required"],
      unique: true,
      trim: true,
      match: [/^\d{10}$/, "Mobile number must contain exactly 10 numeric digits"],
    },
    dateOfBirth: {
      type: String,
      required: [true, "Date of birth is required"],
      match: [/^\d{4}-\d{2}-\d{2}$/, "Date of birth must follow YYYY-MM-DD format"],
    },
    // Hackathon storage only: never serialize or return the full Aadhaar number.
    aadhaarEncrypted: { type: String, required: true, select: false },
    aadhaarFingerprint: { type: String, required: true, unique: true, select: false },
    aadhaarLast4: { type: String, required: true, match: [/^\d{4}$/] },
    // Format/uniqueness checks are not UIDAI authentication.
    identityVerificationStatus: {
      type: String,
      enum: ["self_declared", "verified"],
      default: "self_declared",
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Strips sensitive password field whenever document is serialized to JSON.
 * Protects against accidental leakage in HTTP responses.
 */
farmerSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.aadhaarEncrypted;
  delete obj.aadhaarFingerprint;
  delete obj.__v;
  return obj;
};

/**
 * Compares plain candidate password with stored bcrypt hash.
 */
farmerSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

farmerSchema.statics.prepareIdentity = (aadhaarNumber) => {
  if (!validateAadhaar(aadhaarNumber)) {
    const error = new Error("Aadhaar number must contain exactly 12 digits.");
    error.statusCode = 400;
    throw error;
  }

  return {
    aadhaarEncrypted: encryptAadhaar(aadhaarNumber),
    aadhaarFingerprint: getAadhaarFingerprint(aadhaarNumber),
    aadhaarLast4: getAadhaarLast4(aadhaarNumber),
  };
};

module.exports = mongoose.model("Farmer", farmerSchema);
