const cron = require("node-cron");
const Appointment = require("../models/appointment.model");
const sendMail = require("./mailer");

cron.schedule("*/5 * * * *", async () => {
  try {
    const nowUTC = new Date();

    const appointments = await Appointment.find({
      status: { $in: ["pending", "confirmed"] },
    });

    for (const appointment of appointments) {
      const match = appointment.appointmentTime.match(/(\d+):(\d+)\s?(AM|PM)/i);

      if (!match) continue;

      let hours = parseInt(match[1]);
      const minutes = parseInt(match[2]);
      const meridian = match[3].toUpperCase();

      if (meridian === "PM" && hours !== 12) hours += 12;
      if (meridian === "AM" && hours === 12) hours = 0;

      const appointmentDateTimeUTC = new Date(
        Date.UTC(
          appointment.appointmentDate.getUTCFullYear(),
          appointment.appointmentDate.getUTCMonth(),
          appointment.appointmentDate.getUTCDate(),
          hours,
          minutes,
          0,
        ),
      );

      console.log("NOW UTC:", nowUTC.toISOString());
      console.log("APPT UTC:", appointmentDateTimeUTC.toISOString());

      if (appointmentDateTimeUTC < nowUTC) {
        appointment.status = "cancelled";
        await appointment.save();
        await sendMail(
          appointment.patientEmail,
          "Appointment Cancelled - Physioterapia Clinic",
          `
          <h3>Dear ${appointment.patientName},</h3>
          <p>Your appointment has been <strong>automatically cancelled</strong> because the scheduled time was missed.</p>

          <p><strong>Service:</strong> ${appointment.serviceId?.title}</p>
          <p><strong>Doctor:</strong> ${appointment.doctorId?.name}</p>
          <p><strong>Date:</strong> ${appointmentDateTimeUTC.toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${appointment.appointmentTime}</p>

          <br/>
          <p>If this was a mistake, please contact us to reschedule.</p>
          <p>— Physioterapia Clinic</p>
          `,
        );
      }

      console.log("✅ Cancelled:", appointment._id);
    }
  } catch (err) {
    console.error("❌ CRON ERROR:", err);
  }
});
