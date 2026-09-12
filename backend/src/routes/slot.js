const express = require("express");
const { Slot } = require("../models/Slot");
const { getProcurementSettings } = require("../models/ProcurementSettings");
const Farmer = require("../models/Farmer");
const { ProcurementTicket } = require("../models/ProcurementTicket");
const verifyToken = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");
const { isValidDateOnly } = require("../utils/date");
const smsService = require("../services/smsService");

const router = express.Router();

const reserveSlotWithinCapacity = async ({ farmerId, ticketId, date, timeSlot, cropType, quantityQuintals, capacity }) => {
  for (let attempt = 0; attempt < capacity; attempt += 1) {
    const activeBookings = await Slot.find({ date, timeSlot, status: "booked" })
      .select("bookingSequence")
      .lean();

    if (activeBookings.length >= capacity) return null;

    const usedSequences = new Set(activeBookings.map((booking) => booking.bookingSequence).filter(Boolean));
    const bookingSequence = Array.from({ length: capacity }, (_, index) => index + 1)
      .find((sequence) => !usedSequences.has(sequence));
    if (!bookingSequence) return null;

    try {
      return await Slot.create({
        farmerId,
        ticketId,
        date,
        timeSlot,
        bookingSequence,
        cropType,
        quantityQuintals,
        status: "booked",
      });
    } catch (error) {
      // Another request claimed this sequence or this ticket's active booking first.
      if (error.code !== 11000) throw error;
    }
  }

  return null;
};

// =========================================================================
// 1. GET AVAILABLE SLOTS FOR A DATE
// =========================================================================
router.get(
  "/available",
  asyncHandler(async (req, res) => {
    const { date } = req.query;
    const settings = await getProcurementSettings();

    if (!isValidDateOnly(date)) {
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

    const availability = settings.timeSlots.map((slot) => {
      const bookedCount = bookingMap[slot] || 0;
      const remainingCapacity = Math.max(0, settings.capacityPerSlot - bookedCount);
      return {
        timeSlot: slot,
        totalCapacity: settings.capacityPerSlot,
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
    const { date, timeSlot, ticketId } = req.body;
    const farmerId = req.user.id;
    const settings = await getProcurementSettings();

    if (!date || !timeSlot || !ticketId) {
      return res.status(400).json({
        success: false,
        error: "Ticket ID, date (YYYY-MM-DD), and time slot are required.",
      });
    }
    if (!isValidDateOnly(date)) {
      return res.status(400).json({ success: false, error: "Date must be a valid YYYY-MM-DD value." });
    }

    const ticket = await ProcurementTicket.findOne({ ticketId, farmerId });
    if (!ticket) {
      return res.status(404).json({ success: false, error: "Procurement ticket not found or not owned by you." });
    }
    if (ticket.status !== "accepted") {
      return res.status(409).json({
        success: false,
        error: `Ticket ${ticketId} cannot book a slot while its status is ${ticket.status}.`,
      });
    }

    const cropType = ticket.crop;
    const quantityQuintals = ticket.expectedWeightQuintals;

    // Check if slot string is valid
    if (!settings.timeSlots.includes(timeSlot)) {
      return res.status(400).json({
        success: false,
        error: "Invalid procurement time slot selected.",
        validSlots: settings.timeSlots,
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

    const slot = await reserveSlotWithinCapacity({
      farmerId,
      ticketId,
      date,
      timeSlot,
      cropType,
      quantityQuintals,
      capacity: settings.capacityPerSlot,
    });

    if (!slot) {
      return res.status(409).json({
        success: false,
        error: `The ${timeSlot} slot on ${date} is fully booked or this ticket already has a booking. Please refresh and choose another slot.`,
      });
    }

    // Only one concurrent request can transition an accepted ticket to slot_booked.
    const reservedTicket = await ProcurementTicket.findOneAndUpdate(
      { _id: ticket._id, status: "accepted" },
      {
        $set: { slotId: slot._id, status: "slot_booked" },
        $push: { statusHistory: { status: "slot_booked", note: `Slot booked for ${date}, ${timeSlot}.` } },
      },
      { new: true }
    );

    if (!reservedTicket) {
      slot.status = "cancelled";
      await slot.save();
      return res.status(409).json({ success: false, error: "This ticket was updated while the slot was being booked. Please refresh and try again." });
    }

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

    const ticket = await ProcurementTicket.findOne({ ticketId: slot.ticketId, farmerId: req.user.id });
    if (ticket && ticket.status === "slot_booked") {
      ticket.slotId = null;
      // The earlier approval is still valid, so the farmer can immediately re-book.
      ticket.status = "accepted";
      ticket.statusHistory.push({ status: "accepted", note: "Booked slot was cancelled; ticket remains accepted for a new slot." });
      await ticket.save();
    }

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
