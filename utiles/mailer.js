import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendMail = async (to, subject, htmlContent) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Physioterapia Clinic <onboarding@resend.dev>",
      to: to,
      subject: subject,
      html: htmlContent,
    });

    if (error) {
      return console.error("Resend API Error:", error);
    }
    console.log("Email sent successfully:", data);
  } catch (error) {
    console.error("Resend Network Error:", error);
  }
};
