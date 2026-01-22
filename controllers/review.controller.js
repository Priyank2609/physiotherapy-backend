const Review = require("../models/review.model");

module.exports.createReview = async (req, res) => {
  try {
    const { name, rating, comment, service } = req.body;

    if (!name || !rating || !comment) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    const review = await Review.create({
      patientName: name,
      rating: Number(rating),
      message: comment,
      service: service,
    });

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports.getAdminReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found in database" });
    }

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ isApproved: true }).sort({
      createdAt: -1,
    });

    if (reviews.length === 0) {
      return res.status(400).json({ message: "No reviews are available" });
    }

    res.status(200).json({ message: "All reviews", reviews });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

module.exports.updateIsApproved = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.body);

    const isApproved =
      req.body.isApproved === "true" || req.body.isApproved === true;

    const review = await Review.findByIdAndUpdate(
      id,
      { $set: { isApproved } },
      { new: true, runValidators: true },
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found in our records.",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Review successfully ${isApproved ? "published" : "hidden"}.`,
      review,
    });
  } catch (error) {
    console.error("Error updating review status:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

module.exports.deleteReview = async (req, res) => {
  try {
    const id = req.params.id;

    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }
    res.status(200).json({ message: "review is deleted ", deletedReview });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went worng", error: error.message });
  }
};
