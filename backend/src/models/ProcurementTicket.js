const crypto = require("crypto");
const mongoose = require("mongoose");

const TICKET_STATUSES = [
  "submitted",
  "under_review",
  "accepted",
  "slot_booked",
  "scheduled",
  "completed",
  "rejected",
  "cancelled",
];

const ticketEventSchema = new mongoose.Schema(
  {
    status: { type: String, enum: TICKET_STATUSES, required: true },
    note: { type: String, required: true, maxlength: 500 },
    recordedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const procurementTicketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
      index: true,
    },
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farmer",
      required: true,
      index: true,
    },
    procurementSubmissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProcurementSubmission",
      required: true,
      unique: true,
    },
    slotId: { type: mongoose.Schema.Types.ObjectId, ref: "Slot", default: null },
    crop: { type: String, required: true },
    expectedWeightQuintals: { type: Number, required: true },
    status: { type: String, enum: TICKET_STATUSES, default: "submitted", index: true },
    statusHistory: {
      type: [ticketEventSchema],
      default: () => [{ status: "submitted", note: "Procurement form submitted." }],
    },
  },
  { timestamps: true }
);

procurementTicketSchema.index({ farmerId: 1, status: 1, createdAt: -1 });

const generateTicketId = () => `FMY-${new Date().getFullYear()}-${crypto.randomUUID().replace(/-/g, "").toUpperCase()}`;

module.exports = {
  ProcurementTicket: mongoose.model("ProcurementTicket", procurementTicketSchema),
  TICKET_STATUSES,
  generateTicketId,
};
