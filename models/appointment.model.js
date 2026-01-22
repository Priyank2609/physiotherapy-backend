const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: true,
      trim: true,
    },

    patientPhone: {
      type: String,
      required: true,
    },

    patientEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DoctorModel",
      required: true,
    },

    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    appointmentDate: {
      type: Date,
      required: true,
    },

    appointmentTime: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },

    message: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Appointment=mongoose.model("Appointment", appointmentSchema)
module.exports = Appointment
