const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASSWORD,
  },
  connectionTimeout: 10000,
});

const sendMail = async (to, subject, html) => {
  try {
    // FIX: Added the email address to the 'from' field
    await transporter.sendMail({
      from: `"Physioterapia Clinic" <${process.env.AUTH_EMAIL}>`,
      to,
      subject,
      html,
    });
    console.log("Email sent successfully to", to);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

module.exports = sendMail;
