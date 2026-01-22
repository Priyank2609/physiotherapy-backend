const express = require("express");
const {
  createReview,
  getAllReviews,
  updateIsApproved,
  deleteReview,
  getAdminReviews,
} = require("../controllers/review.controller");
const { protect } = require("../middleware/protect.middleware");
const { authRole } = require("../middleware/authRole.middleware");

const router = express.Router();

router.post("/create", createReview);
router.get("/", getAllReviews);

router.get("/admin-reviews", protect, authRole(["Admin"]), getAdminReviews);
router.patch("/:id", protect, authRole(["Admin"]), updateIsApproved);
router.delete("/delete/:id", protect, authRole(["Admin"]), deleteReview);

module.exports = router;
