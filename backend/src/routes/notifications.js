const express = require("express");
const FarmerNotification = require("../models/FarmerNotification");
const verifyToken = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get(
  "/mine",
  verifyToken,
  asyncHandler(async (req, res) => {
    const notifications = await FarmerNotification.find({ farmerId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    const unreadCount = notifications.filter((notification) => !notification.readAt).length;
    res.json({ success: true, unreadCount, notifications });
  })
);

router.patch(
  "/:id/read",
  verifyToken,
  asyncHandler(async (req, res) => {
    const notification = await FarmerNotification.findOneAndUpdate(
      { _id: req.params.id, farmerId: req.user.id },
      { readAt: new Date() },
      { new: true }
    );
    if (!notification) return res.status(404).json({ success: false, error: "Notification not found." });
    res.json({ success: true, notification });
  })
);

module.exports = router;
