const { default: mongoose } = require("mongoose");
const Service = require("../models/service.model");
const serviceModel = require("../models/service.model");

module.exports.createService = async (req, res) => {
  try {
    const {
      title,
      shortDescription,
      longDescription,
      benefits,
      treatments,
      duration,
      price,
      isActive,
    } = req.body;

    if (
      !title ||
      !shortDescription ||
      !longDescription ||
      !benefits ||
      !duration ||
      !treatments ||
      !price
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    let parsedBenefits = [];
    if (Array.isArray(benefits)) {
      parsedBenefits = benefits;
    } else if (typeof benefits === "string") {
      try {
        parsedBenefits = JSON.parse(benefits);
        if (!Array.isArray(parsedBenefits)) throw new Error();
      } catch {
        return res.status(400).json({
          success: false,
          message: "Benefits must be sent as a JSON array",
        });
      }
    }

    if (parsedBenefits.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Benefits cannot be empty",
      });
    }

    let parsedTreatments = [];
    if (treatments) {
      if (Array.isArray(treatments)) {
        parsedTreatments = treatments;
      } else if (typeof treatments === "string") {
        try {
          parsedTreatments = JSON.parse(treatments);
          if (!Array.isArray(parsedTreatments)) parsedTreatments = [];
        } catch {
          parsedTreatments = [];
        }
      }
    }

    const mainImage = req.files?.mainImage?.[0]?.path;
    const secondaryImage = req.files?.secondaryImage?.[0]?.path;

    if (!mainImage || !secondaryImage) {
      return res.status(400).json({
        success: false,
        message: "Both images are required",
      });
    }

    const service = await Service.create({
      title,
      shortDescription,
      longDescription,
      benefits: parsedBenefits,
      treatments: parsedTreatments,
      duration: Number(duration),
      price: Number(price),
      isActive: isActive !== undefined ? isActive : true,
      mainImage,
      secondaryImage,
    });

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true })
      .select("title shortDescription price duration mainImage")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "All services",
      data: services,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.totalServices = async (req, res) => {
  try {
    const service = await serviceModel.find();

    const totalService = service.length;

    res.status(200).json({ message: "Total services", totalService });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

module.exports.getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID",
      });
    }

    const service = await Service.findOne({
      _id: id,
      isActive: true,
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Service details",
      data: service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID",
      });
    }

    const updateData = { ...req.body };

    if (updateData.benefits) {
      updateData.benefits =
        typeof updateData.benefits === "string"
          ? JSON.parse(updateData.benefits)
          : updateData.benefits;
    }

    if (req.files?.mainImage) {
      updateData.mainImage = req.files.mainImage[0].path;
    }

    if (req.files?.secondaryImage) {
      updateData.secondaryImage = req.files.secondaryImage[0].path;
    }

    const service = await Service.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Service deactivated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
