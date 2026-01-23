const { TransactionalEmailsApi, SendSmtpEmail } = require("@getbrevo/brevo");

// Create the API instance
const apiInstance = new TransactionalEmailsApi();

// Set the API key using setApiKey (0 = default auth type for api-key)
apiInstance.setApiKey(0, process.env.BREVO_API_KEY.trim());

// Optional: Confirm it's set (remove later)
console.log(
  "Brevo API key length:",
  process.env.BREVO_API_KEY?.length || "missing",
);

const sendMail = async (to, subject, html) => {
  try {
    const sendSmtpEmail = new SendSmtpEmail();

    sendSmtpEmail.sender = {
      email: "priyankprajapati1203@gmail.com",
      name: "Physioterapia Clinic",
    };

    sendSmtpEmail.to = [{ email: to }];

    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    // console.log("data", data);

    console.log("Email sent successfully → ID:", data.body.messageId);
    return true;
  } catch (err) {
    console.error("Brevo error details:", err);
    if (err.response?.data) {
      console.error("Brevo response:", err.response.data);
      console.error("Status:", err.response.status);
    }
    return false;
  }
};

module.exports = sendMail;
