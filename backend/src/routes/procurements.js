const express = require("express");
const { ProcurementSubmission } = require("../models/ProcurementSubmission");
const verifyToken = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

// Submit a farmer's produce-intake details. Identity always comes from the JWT.
router.post(
  "/",
  verifyToken,
  asyncHandler(async (req, res) => {
    const { surveyNumber, crop, expectedWeightQuintals, bankAccountNumber, ifsc } = req.body;

    const submission = await ProcurementSubmission.create({
      farmerId: req.user.id,
      surveyNumber,
      crop,
      expectedWeightQuintals,
      bankAccountNumber,
      ifsc: typeof ifsc === "string" ? ifsc.toUpperCase() : ifsc,
    });

    res.status(201).json({
      success: true,
      message: "Produce intake details submitted successfully.",
      submission,
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
