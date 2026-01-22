const express = require("express");
const router = require("./user.route");
const {
  createDoctor,
  getAllDoctor,
  getDoctorById,
  deleteDoctor,
  updateDoctor,
} = require("../controllers/doctor.controller");
const { protect } = require("../middleware/protect.middleware");
const { storage } = require("../config/cloudinary");
const { authRole } = require("../middleware/authRole.middleware");
const multer = require("multer");
const upload = multer({ storage });

router.post(
  "/create-doctor",
  protect,
  authRole(["Admin"]),
  upload.single("profileImage"),
  createDoctor,
);
router.get("/all", getAllDoctor);
router.get("/doc/:id", getDoctorById);
router.patch(
  "/update/:id",
  protect,
  authRole(["Admin"]),
  upload.single("profileImage"),
  updateDoctor,
);
router.delete("/del/:id", protect, authRole(["Admin"]), deleteDoctor);

module.exports = router;
