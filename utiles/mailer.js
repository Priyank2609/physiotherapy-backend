const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, // Changed from 587
  secure: true, // Changed from false
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASSWORD,
  },
  // Add these to make the connection more robust
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,
});

const sendMail = async (to, subject, html) => {
  try {
    // Verify the connection configuration before sending
    await transporter.verify();

    await transporter.sendMail({
      from: `"Physioterapia Clinic" `, // Ensure from includes your email
      to,
      subject,
      html,
    });
    console.log("Email sent successfully to", to);
    return true; // Return success
  } catch (error) {
    console.error("Error sending email:", error);
    return false; // Return failure
  }
};

module.exports = sendMail;
