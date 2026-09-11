const mongoose = require("mongoose");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Farmer = require("../models/Farmer");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { fullname, mobileNumber, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const farmer = new Farmer({ fullname, mobileNumber, password: hashedPassword });
    await farmer.save();
    res.json({ message: "Farmer registered successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { mobileNumber, password } = req.body;
  try {
    const farmer = await Farmer.findOne({ mobileNumber });
    if (!farmer) return res.status(404).json({ error: "Farmer not found" });

    const isMatch = await bcrypt.compare(password, farmer.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: farmer._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, farmer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
