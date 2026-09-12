const mongoose = require("mongoose");

const CROP_OPTIONS = [
  "paddy", "paddy-a", "cotton-m", "cotton-l", "wheat", "maize",
  "groundnut", "mustard", "soybean", "ragi", "tur", "moong", "urad",
  "gram", "jute", "sugarcane",
];

const procurementSubmissionSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farmer",
      required: [true, "Farmer ID is required"],
      index: true,
    },
    surveyNumber: {
      type: String,
      required: [true, "Land survey number is required"],
      trim: true,
      minlength: [2, "Land survey number must be at least 2 characters"],
      maxlength: [100, "Land survey number cannot exceed 100 characters"],
    },
    crop: {
      type: String,
      required: [true, "Crop is required"],
      enum: CROP_OPTIONS,
    },
    expectedWeightQuintals: {
      type: Number,
      required: [true, "Expected crop weight is required"],
      min: [1, "Expected crop weight must be at least 1 quintal"],
      max: [5000, "Expected crop weight cannot exceed 5000 quintals"],
    },
    bankAccountNumber: {
      type: String,
      required: [true, "Bank account number is required"],
      match: [/^\d{9,18}$/, "Bank account number must contain 9 to 18 digits"],
      select: false,
    },
    ifsc: {
      type: String,
      required: [true, "Bank IFSC code is required"],
      uppercase: true,
      trim: true,
      match: [/^[A-Z]{4}0[A-Z0-9]{6}$/, "Enter a valid 11-character IFSC code"],
    },
    status: {
      type: String,
      enum: ["submitted", "under_review", "approved", "rejected"],
      default: "submitted",
      index: true,
    },
    ticketId: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_document, returned) => {
        delete returned.bankAccountNumber;
        delete returned.__v;
        return returned;
      },
    },
  }
);

procurementSubmissionSchema.index({ farmerId: 1, createdAt: -1 });

module.exports = {
  ProcurementSubmission: mongoose.model("ProcurementSubmission", procurementSubmissionSchema),
  CROP_OPTIONS,
};
