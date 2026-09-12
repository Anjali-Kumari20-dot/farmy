const express = require("express");
const { ProcurementSubmission } = require("../models/ProcurementSubmission");
const { ProcurementTicket, generateTicketId } = require("../models/ProcurementTicket");
const Farmer = require("../models/Farmer");
const verifyToken = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

// Submit a farmer's produce-intake details. Identity always comes from the JWT.
router.post(
  "/",
  verifyToken,
  asyncHandler(async (req, res) => {
    const { surveyNumber, crop, expectedWeightQuintals, bankAccountNumber, ifsc } = req.body;
    const farmer = await Farmer.findById(req.user.id);

    if (!farmer?.dateOfBirth || !farmer.aadhaarLast4) {
      return res.status(409).json({
        success: false,
        error: "Complete your date of birth and Aadhaar identity profile before submitting a procurement form.",
      });
    }

    const existingActiveTicket = await ProcurementTicket.findOne({
      farmerId: req.user.id,
      crop,
      status: { $in: ["submitted", "under_review", "slot_booked", "scheduled"] },
    });

    if (existingActiveTicket) {
      return res.status(409).json({
        success: false,
        error: `You already have an active ${crop} procurement ticket: ${existingActiveTicket.ticketId}.`,
        ticketId: existingActiveTicket.ticketId,
      });
    }

    const ticketId = generateTicketId();

    const submission = await ProcurementSubmission.create({
      farmerId: req.user.id,
      surveyNumber,
      crop,
      expectedWeightQuintals,
      bankAccountNumber,
      ifsc: typeof ifsc === "string" ? ifsc.toUpperCase() : ifsc,
      ticketId,
    });

    const ticket = await ProcurementTicket.create({
      ticketId,
      farmerId: req.user.id,
      procurementSubmissionId: submission._id,
      crop,
      expectedWeightQuintals,
    });

    res.status(201).json({
      success: true,
      message: "Produce intake details submitted and ticket generated successfully.",
      submission,
      ticket,
    });
  })
);

// Return only the authenticated farmer's own submission history.
router.get(
  "/mine",
  verifyToken,
  asyncHandler(async (req, res) => {
    const submissions = await ProcurementSubmission.find({ farmerId: req.user.id })
      .sort({ createdAt: -1 });

    res.json({ success: true, count: submissions.length, submissions });
  })
);

module.exports = router;
