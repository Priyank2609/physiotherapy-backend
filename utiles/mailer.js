// mailer.js - FIXED VERSION
const Brevo = require("@getbrevo/brevo");

const apiInstance = new Brevo.TransactionalEmailsApi();

// THIS is the correct way to set the key (direct property assignment)
apiInstance.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

// Optional: Log to confirm it's set (remove in production)
console.log(
  "API Key set (length):",
  apiInstance.authentications["api-key"].apiKey?.length || "NOT SET",
);

const sendMail = async (to, subject, html) => {
  try {
    const sendSmtpEmail = new Brevo.SendSmtpEmail();

    sendSmtpEmail.sender = {
      email: "priyankprajapati1203@gmail.com",
      name: "Physioterapia Clinic",
    };

    sendSmtpEmail.to = [{ email: to }];
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log("Email sent successfully → Message ID:", response.messageId);
    return true;
  } catch (err) {
    console.error("Brevo full error:", err);
    if (err.response) {
      console.error("Brevo response:", err.response.data);
      console.error("Status code:", err.response.status);
    }
    return false;
  }
};

module.exports = sendMail;
