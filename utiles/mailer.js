const nodemailer = require("nodemailer");

// Step 1: Create transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASSWORD,
  },
});

const sendMail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: '"Physioterapia Clinic" ',

      to,
      subject,
      html,
    });
    console.log("Email sent successfully to", to);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendMail;
