const express = require("express");
const {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  todayAppointment,
  overviewApponiment,
  upcomingAppointment,
} = require("../controllers/appointment.controller");
const { protect } = require("../middleware/protect.middleware");
const { authRole } = require("../middleware/authRole.middleware");
const router = express.Router();

router.post("/create", createAppointment);

router.get("/today", protect, authRole(["Admin"]), todayAppointment);
router.get("/overview", protect, authRole(["Admin"]), overviewApponiment);
router.get("/upcoming", protect, authRole(["Admin"]), upcomingAppointment);
router.get("/", protect, authRole(["Admin"]), getAllAppointments);
router.get("/:id", protect, authRole(["Admin"]), getAppointmentById);
router.patch(
  "/:id/status",
  protect,
  authRole(["Admin"]),
  updateAppointmentStatus
);

module.exports = router;
