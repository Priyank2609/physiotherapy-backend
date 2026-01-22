const express = require("express");
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  deleteBlog,
  updateBlog,
  getAdminBlogs,
} = require("../controllers/blog.controller");
const { storage } = require("../config/cloudinary");
const multer = require("multer");
const { protect } = require("../middleware/protect.middleware");
const { authRole } = require("../middleware/authRole.middleware");
const upload = multer({ storage });

const router = express.Router();

router.post(
  "/create",
  protect,
  authRole(["Admin"]),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "exerciseImages", maxCount: 10 },
  ]),
  createBlog,
);
router.patch(
  "/update/:id",
  protect,
  authRole(["Admin"]),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "exerciseImages", maxCount: 10 },
  ]),
  updateBlog,
);
router.delete("/delete/:id", protect, authRole(["Admin"]), deleteBlog);
router.get("/admin-blogs", protect, authRole(["Admin"]), getAdminBlogs);
router.get("/get-blogs", getAllBlogs);
router.get("/:slug", getBlogById);

module.exports = router;
