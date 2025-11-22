const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

const sendOTP = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Password Reset OTP - StockMaster",
      html: `<p>Your password reset OTP is: <strong>${otp}</strong></p><p>This OTP will expire in 10 minutes.</p>`,
    })
  } catch (error) {
    console.error("Email send error:", error)
  }
}

module.exports = { sendOTP }
