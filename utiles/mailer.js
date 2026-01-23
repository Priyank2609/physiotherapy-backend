const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_EMAIL,
    pass: process.env.BREVO_SMTP_KEY,
  },
});

module.exports = transporter;

const sendMail = async (to, subject, html) => {
  try {
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
