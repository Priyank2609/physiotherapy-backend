const SibApiV3Sdk = require("@sendinblue/client");

// Create an instance of the transactional emails API
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Set API key
apiInstance.apiClient.authentications["api-key"].apiKey =
  process.env.BREVO_API_KEY;

const sendMail = async (to, subject, html) => {
  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail({
      sender: {
        email: "priyankprajapati1203@gmail.com",
        name: "Physioterapia Clinic",
      },
      to: [{ email: to }],
      subject,
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
