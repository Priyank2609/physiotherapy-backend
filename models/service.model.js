const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    shortDescription: {
      type: String,
      required: true,
      trim: true,
    },

    longDescription: {
      type: String,
      required: true,
    },

    benefits: {
      type: [String],
      required: true,
    },

    treatments: {
      type: [String],
      default: [],
    },

    duration: {
      type: Number,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    mainImage: {
      type: String,
      required: true,
    },

    secondaryImage: {
      type: String,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Service", serviceSchema);
