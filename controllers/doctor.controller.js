const mongoose = require("mongoose");
const DoctorModel = require("../models/doctor.model");

module.exports.createDoctor = async (req, res) => {
  try {
    let {
      name,
      specialization,
      qualifications,
      availability,
      bio,
      conditionsTreated,
      neurologicalExpertise,
      clinicalBackground,
    } = req.body;

    const experience = Number(req.body.experience);
    if (isNaN(experience) || experience < 0 || experience > 50) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid experience (0–50 years)",
      });
    }

    try {
      qualifications = qualifications ? JSON.parse(qualifications) : [];
      availability = availability ? JSON.parse(availability) : {};
      conditionsTreated = conditionsTreated
        ? JSON.parse(conditionsTreated)
        : [];
      neurologicalExpertise = neurologicalExpertise
        ? JSON.parse(neurologicalExpertise)
        : [];
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Invalid JSON format in request body",
      });
    }

    if (!name || name.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: "Doctor name must be at least 3 characters long",
      });
    }

    if (!specialization || specialization.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: "Specialization is required",
      });
    }

    if (!Array.isArray(qualifications) || qualifications.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one qualification is required",
      });
    }

    if (!clinicalBackground || clinicalBackground.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message:
          "Clinical background must be at least 50 characters for premium profile",
      });
    }

    const existingDoctor = await DoctorModel.findOne({
      name: name.trim(),
      specialization: specialization.trim(),
      isDeleted: false,
    });

    if (existingDoctor) {
      return res.status(409).json({
        success: false,
        message: "Doctor with same name and specialization already exists",
      });
    }

    const image = req.file?.path;
    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Doctor profile image is required",
      });
    }

    const doctor = await DoctorModel.create({
      name: name.trim(),
      specialization: specialization.trim(),
      experience,
      profileImage: image,
      qualifications,
      availability,
      bio,
      conditionsTreated,
      neurologicalExpertise,
      clinicalBackground,
    });

    res.status(201).json({
      success: true,
      message: "Doctor created successfully",
      data: doctor,
    });
  } catch (error) {
    console.error("Create Doctor Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports.getAllDoctor = async (req, res) => {
  try {
    const doctors = await DoctorModel.find({
      isActive: true,
      isDeleted: false,
    });

    if (!doctors || doctors.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No doctors found",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "All Doctors",
      data: doctors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

module.exports.getDoctorById = async (req, res) => {
  try {
    const docId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(docId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor ID",
      });
    }

    const doctor = await DoctorModel.findOne({
      _id: docId,
      isDeleted: false,
    });

    if (!doctor || !doctor.isActive) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Doctor details",
      data: doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

module.exports.updateDoctor = async (req, res) => {
  try {
    const docId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(docId)) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    let updateData = { ...req.body };

    const jsonFields = [
      "qualifications",
      "conditionsTreated",
      "neurologicalExpertise",
      "availability",
    ];

    jsonFields.forEach((field) => {
      if (updateData[field] && typeof updateData[field] === "string") {
        try {
          updateData[field] = JSON.parse(updateData[field]);
        } catch (e) {
          console.error(`Error parsing ${field}:`, e);
        }
      }
    });

    if (req.file) {
      updateData.profileImage = req.file.path;
    }

    const updatedDoctor = await DoctorModel.findOneAndUpdate(
      { _id: docId, isDeleted: false },
      { $set: updateData },
      { new: true, runValidators: true },
    );

    if (!updatedDoctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    res.status(200).json({ success: true, data: updatedDoctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
module.exports.deleteDoctor = async (req, res) => {
  try {
    const docId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(docId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor ID",
      });
    }

    const deletedDoctor = await DoctorModel.findByIdAndUpdate(
      docId,
      {
        $set: {
          isDeleted: true,
          isActive: false,
          deletedAt: new Date(),
        },
      },
      { new: true },
    );

    if (!deletedDoctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Doctor deleted successfully",
      data: deletedDoctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
