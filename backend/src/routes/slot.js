const express = require("express");
const Slot = require("../models/Slot");
const router = express.Router();

// Book a slot
router.post("/book", async (req, res) => {
  const { farmerId, date, timeSlot } = req.body;
  try {
    const slot = new Slot({ farmerId, date, timeSlot });
    await slot.save();
    res.json({ message: "Slot booked successfully", slot });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get farmer slots
router.get("/:farmerId", async (req, res) => {
  try {
    const slots = await Slot.find({ farmerId: req.params.farmerId });
    res.json(slots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
