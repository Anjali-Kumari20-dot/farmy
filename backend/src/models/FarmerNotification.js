const mongoose = require("mongoose");

const farmerNotificationSchema = new mongoose.Schema(
  {
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "Farmer", required: true, index: true },
    ticketId: { type: String, default: null, index: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    message: { type: String, required: true, trim: true, maxlength: 1000 },
    type: { type: String, enum: ["ticket", "slot", "identity", "general"], default: "general" },
    channel: { type: String, enum: ["in_app"], default: "in_app" },
    readAt: { type: Date, default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
  },
  { timestamps: true }
);

farmerNotificationSchema.index({ farmerId: 1, readAt: 1, createdAt: -1 });

module.exports = mongoose.model("FarmerNotification", farmerNotificationSchema);
