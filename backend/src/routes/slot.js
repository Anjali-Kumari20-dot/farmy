const express = require("express");
const { Slot, VALID_TIME_SLOTS } = require("../models/Slot");
const Farmer = require("../models/Farmer");
const verifyToken = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");
const smsService = require("../services/smsService");

const router = express.Router();

// Procurement center capacity per time slot (concurrent farmers processed)
const MAX_FARMERS_PER_SLOT = 5;

// =========================================================================
// 1. GET AVAILABLE SLOTS FOR A DATE
// =========================================================================
router.get(
  "/available",
  asyncHandler(async (req, res) => {
    const { date } = req.query;

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        success: false,
        error: "Valid date query parameter in YYYY-MM-DD format is required.",
      });
    }

    // Aggregate active bookings for this date grouped by timeSlot
    const activeBookings = await Slot.aggregate([
      { $match: { date, status: "booked" } },
      { $group: { _id: "$timeSlot", count: { $sum: 1 } } },
    ]);

    const bookingMap = {};
    activeBookings.forEach((item) => {
      bookingMap[item._id] = item.count;
    });

    const availability = VALID_TIME_SLOTS.map((slot) => {
      const bookedCount = bookingMap[slot] || 0;
      const remainingCapacity = Math.max(0, MAX_FARMERS_PER_SLOT - bookedCount);
      return {
        timeSlot: slot,
        totalCapacity: MAX_FARMERS_PER_SLOT,
        bookedCount,
        available: remainingCapacity > 0,
        remainingCapacity,
      };
    });

    res.json({
      success: true,
      date,
      slots: availability,
    });
  })
);

// =========================================================================
// 2. BOOK A SLOT (Protected)
// =========================================================================
router.post(
  "/book",
  verifyToken,
  asyncHandler(async (req, res) => {
    const { date, timeSlot, cropType = "Wheat", quantityQuintals = 20 } = req.body;
    const farmerId = req.user.id;

    if (!date || !timeSlot) {
      return res.status(400).json({
        success: false,
        error: "Date (YYYY-MM-DD) and time slot are required.",
      });
    }

    // Check if slot string is valid
    if (!VALID_TIME_SLOTS.includes(timeSlot)) {
      return res.status(400).json({
        success: false,
        error: "Invalid procurement time slot selected.",
        validSlots: VALID_TIME_SLOTS,
      });
    }

    // Validate that the booking date is not in the past
    const todayStr = new Date().toISOString().split("T")[0];
    if (date < todayStr) {
      return res.status(400).json({
        success: false,
        error: "Cannot book procurement slots for past dates.",
      });
    }

    // Check if this farmer already has an active booking for this time
    const existingFarmerBooking = await Slot.findOne({
      farmerId,
      date,
      timeSlot,
      status: "booked",
    });

    if (existingFarmerBooking) {
      return res.status(409).json({
        success: false,
        error: `You already have an active booking for ${timeSlot} on ${date}.`,
      });
    }

    // Concurrency / capacity control: verify procurement centre capacity
    const currentBookedCount = await Slot.countDocuments({
      date,
      timeSlot,
      status: "booked",
    });

    if (currentBookedCount >= MAX_FARMERS_PER_SLOT) {
      return res.status(409).json({
        success: false,
        error: `The ${timeSlot} slot on ${date} is fully booked (${MAX_FARMERS_PER_SLOT}/${MAX_FARMERS_PER_SLOT}). Please pick another slot.`,
      });
    }

    // Create the booking safely attached to authenticated farmerId
    const slot = await Slot.create({
      farmerId,
      date,
      timeSlot,
      cropType,
      quantityQuintals,
      status: "booked",
    });

    // Fetch farmer profile for dispatching SMS confirmation
    const farmer = await Farmer.findById(farmerId);
    if (farmer && farmer.mobileNumber) {
      await smsService.sendSlotConfirmationSms({
        mobileNumber: farmer.mobileNumber,
        farmerName: farmer.fullname,
        cropType,
        quantityQuintals,
        date,
        timeSlot,
        bookingId: slot._id,
      });
    }

    res.status(201).json({
      success: true,
      message: "Procurement slot booked successfully. Confirmation SMS sent.",
      slot,
    });
  })
);

// =========================================================================
// 3. GET LOGGED-IN FARMER'S SLOTS (Protected - Fixes IDOR)
// =========================================================================
router.get(
  "/my-slots",
  verifyToken,
  asyncHandler(async (req, res) => {
    const slots = await Slot.find({ farmerId: req.user.id })
      .sort({ date: 1, timeSlot: 1, createdAt: -1 })
      .populate("farmerId", "fullname mobileNumber");

    res.json({
      success: true,
      count: slots.length,
      slots,
    });
  })
);

// =========================================================================
// 4. CANCEL A SLOT (Protected - Farmer can only cancel their own slot)
// =========================================================================
router.patch(
  "/:id/cancel",
  verifyToken,
  asyncHandler(async (req, res) => {
    const slot = await Slot.findOne({
      _id: req.params.id,
      farmerId: req.user.id,
    });

    if (!slot) {
      return res.status(404).json({
        success: false,
        error: "Procurement slot not found or you are not authorized to cancel it.",
      });
    }

    if (slot.status === "cancelled") {
      return res.status(400).json({
        success: false,
        error: "This slot has already been cancelled.",
      });
    }

    if (slot.status === "completed") {
      return res.status(400).json({
        success: false,
        error: "Completed procurement slots cannot be cancelled.",
      });
    }

    slot.status = "cancelled";
    await slot.save();

    // Fetch farmer to send cancellation notification SMS
    const farmer = await Farmer.findById(req.user.id);
    if (farmer && farmer.mobileNumber) {
      await smsService.sendSlotCancellationSms({
        mobileNumber: farmer.mobileNumber,
        farmerName: farmer.fullname,
        date: slot.date,
        timeSlot: slot.timeSlot,
        bookingId: slot._id,
      });
    }

    res.json({
      success: true,
      message: "Procurement slot cancelled successfully. Notification SMS sent.",
      slot,
    });
  })
);

module.exports = router;
