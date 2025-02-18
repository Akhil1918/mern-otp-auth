const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')
const { v4: uuidv4 } = require('uuid')
const OTP = require('../models/OTP')

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: true,
  port: 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

// Generate random 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString()

// Send OTP
router.post('/send-otp', async (req, res) => {
  const { email } = req.body
  const otp = generateOTP()

  try {
    // Save OTP to database
    await OTP.findOneAndUpdate(
      { email },
      { email, otp },
      { upsert: true, new: true }
    )

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP is: ${otp}`
    })

    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Error sending OTP:', error)
    res.status(500).json({ success: false, message: 'Failed to send OTP' })
  }
})

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body

  try {
    const otpRecord = await OTP.findOne({ email, otp })
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' })
    }

    // Delete OTP after successful verification
    await OTP.deleteOne({ _id: otpRecord._id })
    
    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Error verifying OTP:', error)
    res.status(500).json({ success: false, message: 'Error verifying OTP' })
  }
})

module.exports = router 