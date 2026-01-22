const { default: mongoose } = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true },
    profileImage: { type: String },
    qualifications: [{ type: String }],

    bio: { type: String },
    conditionsTreated: [{ type: String }],
    neurologicalExpertise: [{ type: String }],
    clinicalBackground: { type: String },

    availability: {
      days: [{ type: String }],
      hours: { start: String, end: String },
    },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true },
);

const DoctorModel = mongoose.model("DoctorModel", doctorSchema);
module.exports = DoctorModel;
