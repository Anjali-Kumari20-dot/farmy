const mongoose = require("mongoose");

const VALID_TIME_SLOTS = [
  "08:00 AM - 10:00 AM",
  "10:00 AM - 12:00 PM",
  "12:00 PM - 02:00 PM",
  "02:00 PM - 04:00 PM",
  "04:00 PM - 06:00 PM",
];

const slotSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farmer",
      required: [true, "Farmer ID is required"],
      index: true,
    },
    ticketId: {
      type: String,
      required: true,
      index: true,
    },
    date: {
      type: String,
      required: [true, "Date is required"],
      match: [/^\d{4}-\d{2}-\d{2}$/, "Date must follow YYYY-MM-DD format"],
      index: true,
    },
    timeSlot: {
      type: String,
      required: [true, "Time slot is required"],
      enum: {
        values: VALID_TIME_SLOTS,
        message: "{VALUE} is not a recognized procurement time slot",
      },
    },
    cropType: {
      type: String,
      trim: true,
      default: "Wheat",
    },
    quantityQuintals: {
      type: Number,
      min: [1, "Quantity must be at least 1 quintal"],
      max: [500, "Quantity cannot exceed 500 quintals per booking"],
      default: 25,
    },
    status: {
      type: String,
      enum: ["booked", "completed", "cancelled"],
      default: "booked",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to quickly look up slot occupancy per date & time
slotSchema.index({ date: 1, timeSlot: 1, status: 1 });

module.exports = {
  Slot: mongoose.model("Slot", slotSchema),
  VALID_TIME_SLOTS,
};
