const express = require("express")
const passport = require("passport")
const crypto = require("crypto")
const User = require("../models/User")
const { sendOTP } = require("../utils/emailService")
const { isAuthenticated } = require("../middleware/auth")

const router = express.Router()

// Sign Up
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, phone, warehouse } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" })
    }

    const user = new User({
      name,
      email,
      password,
      phone,
      warehouse,
    })

    await user.save()
    res.status(201).json({ message: "User created successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Login
router.post("/login", passport.authenticate("local"), (req, res) => {
  res.json({
    message: "Login successful",
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      warehouse: req.user.warehouse,
    },
  })
})

// Logout
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.json({ message: "Logged out successfully" })
  })
})

// Get Current User
router.get("/me", isAuthenticated, (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    warehouse: req.user.warehouse,
  })
})

// Request Password Reset
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    user.resetToken = crypto.createHash("sha256").update(otp).digest("hex")
    user.resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000)

    await user.save()
    await sendOTP(email, otp)

    res.json({ message: "OTP sent to email" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Verify OTP and Reset Password
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex")

    const user = await User.findOne({
      email,
      resetToken: hashedOtp,
      resetTokenExpiry: { $gt: Date.now() },
    })

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired OTP" })
    }

    user.password = newPassword
    user.resetToken = undefined
    user.resetTokenExpiry = undefined

    await user.save()
    res.json({ message: "Password reset successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
