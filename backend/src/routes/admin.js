const express = require("express");
const Farmer = require("../models/Farmer");
const FarmerNotification = require("../models/FarmerNotification");
const { ProcurementTicket, TICKET_STATUSES } = require("../models/ProcurementTicket");
const { ProcurementSubmission } = require("../models/ProcurementSubmission");
const { ProcurementSettings, getProcurementSettings } = require("../models/ProcurementSettings");
const { requireAdmin, requireRole } = require("../middleware/adminAuth");
const asyncHandler = require("../utils/asyncHandler");
const { isValidDateOnly } = require("../utils/date");

const router = express.Router();
router.use(requireAdmin);

const TICKET_DECISION_STATUSES = ["submitted", "under_review", "accepted", "rejected"];
const TIME_SLOT_PATTERN = /^\d{2}:\d{2} (AM|PM) - \d{2}:\d{2} (AM|PM)$/;
const submissionStatusByTicketStatus = {
  submitted: "submitted",
  under_review: "under_review",
  accepted: "approved",
  rejected: "rejected",
};

router.get(
  "/tickets",
  asyncHandler(async (req, res) => {
    const { status, search = "" } = req.query;
    const query = {};
    if (status && TICKET_STATUSES.includes(status)) query.status = status;
    if (search.trim()) query.ticketId = { $regex: search.trim(), $options: "i" };
    const tickets = await ProcurementTicket.find(query)
      .populate("farmerId", "fullname mobileNumber dateOfBirth aadhaarLast4 identityVerificationStatus")
      .sort({ createdAt: -1 })
      .limit(100);
    res.json({ success: true, count: tickets.length, tickets });
  })
);

router.get(
  "/tickets/:ticketId",
  asyncHandler(async (req, res) => {
    const ticket = await ProcurementTicket.findOne({ ticketId: req.params.ticketId })
      .populate("farmerId", "fullname mobileNumber dateOfBirth aadhaarLast4 identityVerificationStatus");
    if (!ticket) return res.status(404).json({ success: false, error: "Procurement ticket not found." });
    const submission = await ProcurementSubmission.findById(ticket.procurementSubmissionId);
    res.json({ success: true, ticket, submission });
  })
);

router.patch(
  "/tickets/:ticketId/status",
  requireRole("super_admin", "procurement_officer"),
  asyncHandler(async (req, res) => {
    const { status, note } = req.body;
    if (!TICKET_DECISION_STATUSES.includes(status)) return res.status(400).json({ success: false, error: "Status must be submitted, under_review, accepted, or rejected." });
    if (!note?.trim()) return res.status(400).json({ success: false, error: "A decision note is required." });
    const ticket = await ProcurementTicket.findOne({ ticketId: req.params.ticketId });
    if (!ticket) return res.status(404).json({ success: false, error: "Procurement ticket not found." });
    if (["slot_booked", "scheduled", "completed", "cancelled"].includes(ticket.status)) return res.status(409).json({ success: false, error: `Ticket cannot be reviewed while status is ${ticket.status}.` });
    ticket.status = status;
    ticket.statusHistory.push({ status, note: note.trim() });
    await ticket.save();
    await ProcurementSubmission.updateOne(
      { _id: ticket.procurementSubmissionId },
      { status: submissionStatusByTicketStatus[status] }
    );
    await FarmerNotification.create({
      farmerId: ticket.farmerId,
      ticketId: ticket.ticketId,
      title: "Procurement ticket updated",
      message: `Ticket ${ticket.ticketId} is now ${status.replaceAll("_", " ")}: ${note.trim()}`,
      type: "ticket",
      createdBy: req.admin.id,
    });
    res.json({ success: true, message: "Ticket status updated and farmer notified in the portal.", ticket });
  })
);

router.patch(
  "/farmers/:farmerId/identity",
  requireRole("super_admin", "procurement_officer"),
  asyncHandler(async (req, res) => {
    const { dateOfBirth, aadhaarNumber } = req.body;
    if (!dateOfBirth && !aadhaarNumber) return res.status(400).json({ success: false, error: "Provide a date of birth or Aadhaar number to update." });
    if (dateOfBirth && !isValidDateOnly(dateOfBirth)) return res.status(400).json({ success: false, error: "Date of birth must be a valid date in YYYY-MM-DD format." });
    const farmer = await Farmer.findById(req.params.farmerId);
    if (!farmer) return res.status(404).json({ success: false, error: "Farmer not found." });
    if (dateOfBirth) farmer.dateOfBirth = dateOfBirth;
    if (aadhaarNumber) Object.assign(farmer, Farmer.prepareIdentity(aadhaarNumber));
    // A back-office correction is a review, not UIDAI identity verification.
    farmer.identityVerificationStatus = "officially_reviewed";
    await farmer.save();
    await FarmerNotification.create({
      farmerId: farmer._id,
      title: "Identity profile updated",
      message: "Your identity profile was updated by the procurement office. No full Aadhaar number is displayed in this portal.",
      type: "identity",
      createdBy: req.admin.id,
    });
    res.json({ success: true, message: "Farmer identity updated.", farmer });
  })
);

router.get(
  "/settings/procurement",
  requireRole("super_admin"),
  asyncHandler(async (req, res) => res.json({ success: true, settings: await getProcurementSettings() }))
);

router.patch(
  "/settings/procurement",
  requireRole("super_admin"),
  asyncHandler(async (req, res) => {
    const { timeSlots, capacityPerSlot } = req.body;
    if (!Array.isArray(timeSlots) || timeSlots.length === 0 || timeSlots.length > 12 || new Set(timeSlots).size !== timeSlots.length || timeSlots.some((slot) => !TIME_SLOT_PATTERN.test(slot))) {
      return res.status(400).json({ success: false, error: "Provide 1 to 12 unique time slots using HH:MM AM - HH:MM PM." });
    }
    if (!Number.isInteger(capacityPerSlot) || capacityPerSlot < 1 || capacityPerSlot > 100) return res.status(400).json({ success: false, error: "Capacity per slot must be an integer between 1 and 100." });
    const settings = await ProcurementSettings.findOneAndUpdate({ key: "default" }, { timeSlots, capacityPerSlot, updatedBy: req.admin.id }, { new: true, upsert: true, runValidators: true });
    res.json({ success: true, message: "Procurement slot settings updated.", settings });
  })
);

router.post(
  "/farmers/:farmerId/notifications",
  requireRole("super_admin", "procurement_officer", "support_officer"),
  asyncHandler(async (req, res) => {
    const { title, message, ticketId = null, type = "general" } = req.body;
    if (!title?.trim() || !message?.trim()) return res.status(400).json({ success: false, error: "Notification title and message are required." });
    if (!["ticket", "slot", "identity", "general"].includes(type)) return res.status(400).json({ success: false, error: "Notification type is invalid." });
    if (!(await Farmer.exists({ _id: req.params.farmerId }))) return res.status(404).json({ success: false, error: "Farmer not found." });
    if (ticketId && !(await ProcurementTicket.exists({ ticketId, farmerId: req.params.farmerId }))) return res.status(400).json({ success: false, error: "The ticket does not belong to this farmer." });
    const notification = await FarmerNotification.create({ farmerId: req.params.farmerId, ticketId, title, message, type, createdBy: req.admin.id });
    res.status(201).json({ success: true, message: "In-app farmer notification created.", notification });
  })
);

module.exports = router;
