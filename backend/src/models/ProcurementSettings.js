const mongoose = require("mongoose");

const DEFAULT_TIME_SLOTS = [
  "08:00 AM - 10:00 AM",
  "10:00 AM - 12:00 PM",
  "12:00 PM - 02:00 PM",
  "02:00 PM - 04:00 PM",
  "04:00 PM - 06:00 PM",
];

const procurementSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, default: "default", immutable: true },
    timeSlots: { type: [String], required: true, default: DEFAULT_TIME_SLOTS },
    capacityPerSlot: { type: Number, required: true, default: 5, min: 1, max: 100 },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },
  },
  { timestamps: true }
);

const getProcurementSettings = async () =>
  ProcurementSettings.findOneAndUpdate(
    { key: "default" },
    { $setOnInsert: { key: "default", timeSlots: DEFAULT_TIME_SLOTS, capacityPerSlot: 5 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

const ProcurementSettings = mongoose.model("ProcurementSettings", procurementSettingsSchema);

module.exports = { DEFAULT_TIME_SLOTS, ProcurementSettings, getProcurementSettings };
