const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const ADMIN_ROLES = ["super_admin", "procurement_officer", "support_officer"];

const adminSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    officialEmail: { type: String, required: true, unique: true, lowercase: true, trim: true, match: /^\S+@\S+\.\S+$/ },
    employeeId: { type: String, required: true, unique: true, uppercase: true, trim: true, match: /^[A-Z0-9-]{4,30}$/ },
    mobileNumber: { type: String, required: true, match: /^\d{10}$/ },
    department: { type: String, required: true, enum: ["procurement", "operations", "support", "administration"] },
    role: { type: String, enum: ADMIN_ROLES, default: "procurement_officer" },
    password: { type: String, required: true, minlength: 10, select: false },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

adminSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

adminSchema.methods.toJSON = function toJSON() {
  const admin = this.toObject();
  delete admin.password;
  delete admin.__v;
  return admin;
};

module.exports = {
  Admin: mongoose.model("Admin", adminSchema),
  ADMIN_ROLES,
};
