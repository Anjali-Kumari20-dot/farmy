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
      trim: true,
    },
    // A per-date/time-slot sequence makes capacity reservation race-safe.
    bookingSequence: { type: Number, min: 1, max: 100 },
    cropType: {
      type: String,
      trim: true,
      default: "Wheat",
    },
    quantityQuintals: {
      type: Number,
      min: [1, "Quantity must be at least 1 quintal"],
      max: [5000, "Quantity cannot exceed 5000 quintals per booking"],
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
// Cancelled bookings leave this partial index, so their capacity can be reused.
slotSchema.index(
  { date: 1, timeSlot: 1, bookingSequence: 1 },
  { unique: true, partialFilterExpression: { status: "booked", bookingSequence: { $exists: true } } }
);
// A ticket can have at most one active slot, even if two booking requests arrive together.
slotSchema.index(
  { ticketId: 1 },
  {
    name: "active_ticket_booking_unique",
    unique: true,
    partialFilterExpression: { status: "booked", ticketId: { $exists: true } },
  }
);

module.exports = {
  Slot: mongoose.model("Slot", slotSchema),
  VALID_TIME_SLOTS,
};
