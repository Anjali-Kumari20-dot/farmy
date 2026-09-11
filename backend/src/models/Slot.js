const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "Farmer", required: true },
  date: { type: String, required: true },
  timeSlot: { type: String, required: true },
  status: { type: String, enum: ["booked", "completed", "cancelled"], default: "booked" }
});

module.exports = mongoose.model("Slot", slotSchema);
