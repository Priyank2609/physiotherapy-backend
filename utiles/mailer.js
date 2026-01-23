// mailer.js
const Brevo = require("@getbrevo/brevo");

const apiInstance = new Brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY, // ← your v3 API key from Brevo dashboard
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

    // Optional: add replyTo, cc, bcc, attachment, params, etc.

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log("Email sent successfully → ID:", data.messageId);
    return true;
  } catch (err) {
    console.error("Brevo API error:", err);
    // Better logging in production:
    // console.error(err?.response?.body || err.message);
    return false;
  }
};

module.exports = sendMail;
