const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: true,
      trim: true,
    },

    // Added Service Field
    service: {
      type: String,
      required: [true, "Please specify the service/treatment received"],
      trim: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
