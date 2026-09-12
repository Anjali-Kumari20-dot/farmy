const mongoose = require("mongoose");

// A unique marker makes initial administrator setup safe against concurrent requests.
const adminBootstrapSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, immutable: true, default: "initial" },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdminBootstrap", adminBootstrapSchema);
