const mongoose = require("mongoose");

const DoctorModel = require("../models/doctor.model");
const Service = require("../models/service.model");
const Appointment = require("../models/appointment.model");
const sendMail = require("../utiles/mailer");

module.exports.createAppointment = async (req, res) => {
  try {
    const {
      patientName,
      patientPhone,
      patientEmail,
      doctorId,
      serviceId,
      appointmentDate,
      appointmentTime,
      message,
    } = req.body;

    if (
      !patientName ||
      !patientPhone ||
      !patientEmail ||
      !doctorId ||
      !serviceId ||
      !appointmentDate ||
      !appointmentTime
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(patientEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    if (!/^[6-9]\d{9}$/.test(patientPhone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(doctorId) ||
      !mongoose.Types.ObjectId.isValid(serviceId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor or service ID",
      });
    }

    const doctor = await DoctorModel.findOne({
      _id: doctorId,
      isActive: true,
      isDeleted: false,
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not available",
      });
    }

    const appointmentDay = new Date(appointmentDate).toLocaleDateString(
      "en-US",
      { weekday: "long" },
    );

    console.log(appointmentDay);

    if (!doctor.availability.days.includes(appointmentDay)) {
      return res.status(400).json({
        success: false,
        message: `Doctor is not available on ${appointmentDay}`,
      });
    }
    const isValidTime12Hour = (time) => {
      const regex = /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;
      return regex.test(time);
    };

    if (!isValidTime12Hour(appointmentTime)) {
      return res.status(400).json({
        success: false,
        message: "Invalid time format. Use hh:mm AM/PM",
      });
    }

    const toMinutes = (time) => {
      const [timePart, modifier] = time.split(" ");
      let [hours, minutes] = timePart.split(":").map(Number);

      if (modifier === "PM" && hours !== 12) {
        hours += 12;
      }
      if (modifier === "AM" && hours === 12) {
        hours = 0;
      }

      return hours * 60 + minutes;
    };

    const appointmentMinutes = toMinutes(appointmentTime);
    console.log("appmin", appointmentMinutes);

    const fromMinutes = toMinutes(doctor.availability.hours.start);
    console.log("frommin", fromMinutes);

    const toMinutesLimit = toMinutes(doctor.availability.hours.end);
    console.log("tomin", toMinutesLimit);

    if (
      appointmentMinutes < fromMinutes ||
      appointmentMinutes >= toMinutesLimit
    ) {
      return res.status(400).json({
        success: false,
        message: "Doctor is not available at this time",
      });
    }

    const duplicateBooking = await Appointment.findOne({
      patientPhone,
      appointmentDate,
      appointmentTime,
      status: { $in: ["pending", "confirmed"] },
    });

    if (duplicateBooking) {
      return res.status(409).json({
        success: false,
        message: "You already have an appointment at this time",
      });
    }

    const existingAppointments = await Appointment.find({
      doctorId,
      appointmentDate,
      status: { $in: ["pending", "confirmed"] },
    });

    for (let appt of existingAppointments) {
      const bookedMinutes = toMinutes(appt.appointmentTime);

      // difference between times
      const diff = Math.abs(appointmentMinutes - bookedMinutes);

      if (diff < 60) {
        return res.status(409).json({
          success: false,
          message: "This time slot is already booked (1 hour gap required)",
        });
      }
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    const appointment = await Appointment.create({
      patientName,
      patientPhone,
      patientEmail,
      doctorId,
      serviceId,
      appointmentDate,
      appointmentTime,
      message,
    });
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate("doctorId", "name specialization")
      .populate("serviceId", "title");

    if (populatedAppointment.patientEmail) {
      const emailContent = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px;">
    <h2 style="color: #064e3b;">Appointment Booked</h2>

    <p>Dear <strong>${populatedAppointment.patientName}</strong>,</p>

    <p>Your appointment has been successfully booked at <strong>Physioterepia Clinic</strong>.</p>

    <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
      <tr>
        <td style="padding: 5px 0;"><strong>Service:</strong></td>
        <td>${populatedAppointment.serviceId.title}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Doctor:</strong></td>
        <td>${populatedAppointment.doctorId.name}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Date:</strong></td>
        <td>${new Date(populatedAppointment.appointmentDate).toLocaleDateString()}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Time:</strong></td>
        <td>${populatedAppointment.appointmentTime}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Status:</strong></td>
        <td style="color: #0ea5e9; font-weight: bold;">${populatedAppointment.status}</td>
      </tr>
    </table>

    <p style="margin-top: 20px;">
      If you have any questions or need to reschedule, please contact us.
    </p>

    <p>We look forward to assisting you with your recovery.</p>

    <p style="margin-top: 20px;"><strong>Physioterepia Clinic</strong></p>
  </div>
  `;

      sendMail(
        populatedAppointment.patientEmail,
        "Appointment Confirmed – Physioterepia Clinic",
        emailContent,
      ).catch((err) =>
        console.error("Appointment created but email failed:", err),
      );
    }

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("doctorId", "name specialization")
      .populate("serviceId", "title")
      .sort({ createdAt: -1 });
    // console.log(appointments);

    if (!appointments.length) {
      return res.status(404).json({
        success: false,
        message: "No appointments found",
      });
    }

    res.status(200).json({
      success: true,
      message: "All Appointments",
      data: appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.getAppointmentById = async (req, res) => {
  try {
    const appointmentId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment ID",
      });
    }

    const appointment = await Appointment.findById(appointmentId)
      .populate("doctorId", "name specialization")
      .populate("serviceId", "title");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment details",
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.todayAppointment = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const startOfDay = new Date(`${today}T00:00:00.000+05:30`);
    const endOfDay = new Date(`${today}T23:59:59.999+05:30`);
    console.log(startOfDay);
    console.log(endOfDay);

    const totalApp = await Appointment.find({
      appointmentDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    })
      .populate("doctorId", "name email")

      .populate("serviceId", "title");
    const todayApp = totalApp.length;

    res.status(200).json({
      message: "Today's Appointments (IST)",
      totalApp,
      todayApp,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports.upcomingAppointment = async (req, res) => {
  try {
    const today = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(today.getDate() + 7);

    const count = await Appointment.countDocuments({
      appointmentDate: { $gte: today, $lte: sevenDaysLater },
    });

    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.overviewApponiment = async (req, res) => {
  const appointment = await Appointment.find();

  const pendingAppointment = appointment.filter(
    (pen) => pen.status === "pending",
  ).length;

  res.status(200).json({ message: "Pending requests", pendingAppointment });
};

module.exports.updateAppointmentStatus = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const { status } = req.body;
    console.log(status);

    const allowedStatus = ["pending", "confirmed", "cancelled", "completed"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment status",
      });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true },
    )
      .populate("doctorId")
      .populate("serviceId");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (appointment.patientEmail) {
      const currentStatus = status.toLowerCase();

      console.log(`Current Status: ${currentStatus}`);

      const isCompleted = currentStatus === "completed";

      const reviewFormLink =
        "https://physioterapiaclinic.vercel.app/review-form";

      const reviewSection = isCompleted
        ? `<div style="margin-top: 20px; padding: 15px; background-color: #f0f9ff; border-radius: 8px; border: 1px dashed #0ea5e9;">
         <p style="margin: 0;">We would love to hear about your experience! Please share your feedback here:</p>
         <p style="margin: 10px 0 0 0;">
           <a href="${reviewFormLink}" style="color: #0ea5e9; font-weight: bold; text-decoration: none; font-size: 16px;">
             Click here to Submit a Review →
           </a>
         </p>
       </div>`
        : "";

      const emailContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px;">
      <h2 style="color: #064e3b;">Appointment Status Updated</h2>
      <p>Dear <strong>${appointment.patientName}</strong>,</p>
      <p>Your appointment for <strong>${appointment.serviceId.title}</strong> has been updated.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
        <tr>
          <td style="padding: 5px 0;"><strong>Doctor:</strong></td>
          <td>${appointment.doctorId.name}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0;"><strong>Status:</strong></td>
          <td style="color: #0ea5e9; font-weight: bold;">${status.toUpperCase()}</td>
        </tr>
      </table>
      
      ${reviewSection}

      <p style="margin-top: 20px;">Thank you for choosing our clinic!</p>
    </div>
  `;

      sendMail(
        appointment.patientEmail,
        "Update: Your Appointment at Physioterepia",
        emailContent,
      ).catch((err) =>
        console.error("Database updated, but email timed out:", err),
      );
    }

    res.status(200).json({
      success: true,
      message: "Appointment status updated and patient notified",
      data: appointment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
