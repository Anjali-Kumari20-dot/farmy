const express = require("express");
const { ProcurementTicket } = require("../models/ProcurementTicket");
const { ProcurementSubmission } = require("../models/ProcurementSubmission");
const verifyToken = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get(
  "/mine",
  verifyToken,
  asyncHandler(async (req, res) => {
    const tickets = await ProcurementTicket.find({ farmerId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, count: tickets.length, tickets });
  })
);

// Ticket IDs are unique, but are still checked against the JWT owner to prevent IDOR.
router.get(
  "/:ticketId",
  verifyToken,
  asyncHandler(async (req, res) => {
    const ticket = await ProcurementTicket.findOne({ ticketId: req.params.ticketId, farmerId: req.user.id });
    if (!ticket) {
      return res.status(404).json({ success: false, error: "Ticket not found or you are not authorized to view it." });
    }

    const submission = await ProcurementSubmission.findOne({ ticketId: ticket.ticketId, farmerId: req.user.id });
    res.json({ success: true, ticket, submission });
  })
);

module.exports = router;
