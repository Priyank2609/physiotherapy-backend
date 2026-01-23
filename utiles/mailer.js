// Correct import
const SibApiV3Sdk = require("@sendinblue/client");

// Initialize the client
const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

// Create transactional email API instance
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

const sendMail = async (to, subject, html) => {
  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail({
      sender: {
        email: "priyankprajapati1203@gmail.com",
        name: "Physioterapia Clinic",
      },
      to: [{ email: to }],
      subject: subject,
      htmlContent: html,
    });

    await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log("Email sent successfully");
    return true;
  } catch (err) {
    console.error("Brevo API error:", err);
    return false;
  }
};

module.exports = sendMail;
