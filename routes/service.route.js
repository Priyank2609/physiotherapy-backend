const express = require("express");
const {
  updateService,
  deleteService,
  getServiceById,
  getAllServices,
  createService,
  totalServices,
} = require("../controllers/service.controller");

const { protect } = require("../middleware/protect.middleware");
const { authRole } = require("../middleware/authRole.middleware");
const router = express.Router();
const { storage } = require("../config/cloudinary");
const multer = require("multer");
const upload = multer({ storage });

router.post(
  "/create",
  protect,
  authRole(["Admin"]),
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "secondaryImage", maxCount: 1 },
  ]),
  createService
);

router.get("/total", protect, authRole(["Admin"]), totalServices);
router.get("/", getAllServices);
router.get("/:id", getServiceById);
router.put(
  "/update/:id",
  protect,
  authRole(["Admin"]),
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "secondaryImage", maxCount: 1 },
  ]),
  updateService
);
router.delete("/delete/:id", protect, authRole(["Admin"]), deleteService);

module.exports = router;
