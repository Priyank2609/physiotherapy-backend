const Blog = require("../models/blog.model");
const { slugify } = require("../utiles/slugify");

module.exports.createBlog = async (req, res) => {
  try {
    const { title, description, author, causes, exercises, managementTips } =
      req.body;

    if (!title || !description || !author) {
      return res.status(400).json({
        success: false,
        message: "Title, Description, and Author are mandatory fields.",
      });
    }

    const mainImage =
      req.files && req.files["image"] ? req.files["image"][0].path : null;
    if (!mainImage) {
      return res
        .status(400)
        .json({ success: false, message: "A main cover image is required." });
    }

    const safeParse = (data) =>
      typeof data === "string" ? JSON.parse(data) : data;

    let parsedCauses = [];
    let parsedExercises = [];
    let parsedTips = [];

    try {
      parsedCauses = safeParse(causes) || [];
      parsedExercises = safeParse(exercises) || [];
      parsedTips = safeParse(managementTips) || [];
    } catch (e) {
      return res.status(400).json({
        success: false,
        message: "Invalid JSON format in nested fields.",
      });
    }

    const exerciseFiles = req.files["exerciseImages"] || [];
    const mappedExercises = parsedExercises.map((ex, index) => {
      if (!ex.name)
        throw new Error(`Exercise at index ${index} is missing a name.`);

      return {
        ...ex,
        image: exerciseFiles[index]
          ? exerciseFiles[index].path
          : ex.image || null,
      };
    });

    const blog = await Blog.create({
      title,
      slug: slugify(title, { lower: true, strict: true }),
      description,
      author,
      causes: parsedCauses,
      exercises: mappedExercises,
      managementTips: parsedTips,
      image: mainImage,
      isPublished: true,
      publishedAt: Date.now(),
    });

    res.status(201).json({
      success: true,
      message: "Medical Guide created successfully!",
      data: blog,
    });
  } catch (error) {
    if (error.message.includes("Exercise at index")) {
      return res.status(400).json({ success: false, message: error.message });
    }

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
module.exports.updateBlog = async (req, res) => {
  console.log("hy");

  let updateData = { ...req.body };
  console.log(req.body);

  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    if (req.body.title) {
      blog.title = req.body.title;
      blog.slug = slugify(req.body.title);
    }
    if (req.body.description) blog.description = req.body.description;
    if (req.body.author) blog.author = req.body.author;

    const parseField = (field) => {
      try {
        return typeof field === "string" ? JSON.parse(field) : field;
      } catch (e) {
        return field;
      }
    };

    if (req.body.causes) blog.causes = parseField(req.body.causes);
    if (req.body.managementTips)
      blog.managementTips = parseField(req.body.managementTips);

    if (req.body.exercises) {
      const exercises = parseField(req.body.exercises);

      blog.exercises = exercises.map((ex, index) => {
        const fileKey = `exerciseImage_${index}`;
        if (req.files && req.files[fileKey]) {
          ex.image = req.files[fileKey][0].path;
        }
        return ex;
      });
    }

    if (req.files && req.files.image) {
      blog.image = req.files.image[0].path;
    }

    if (req.body.isPublished !== undefined) {
      const status =
        req.body.isPublished === "true" || req.body.isPublished === true;
      blog.isPublished = status;
      blog.publishedAt = status ? new Date() : null;
    }

    await blog.save();

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: blog,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
module.exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true }).sort({
      publishedAt: -1,
    });
    res.status(200).json({ message: "All Blogs", blogs });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};
// Get all blogs for Admin (including drafts)
module.exports.getAdminBlogs = async (req, res) => {
  try {
    // Admin should see everything, sorted by newest first
    const blogs = await Blog.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: blogs.length,
      message: "Admin Blog List fetched successfully",
      blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin blogs",
      error: error.message,
    });
  }
};

module.exports.getBlogById = async (req, res) => {
  try {
    const slug = req.params.slug;
    const blog = await Blog.findOne({ slug });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }
    res.status(200).json({ message: "Blog Details", blog });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

module.exports.deleteBlog = async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) {
      return res.status(400).json({ message: "Blog does not exist" });
    }
    res.status(200).json({ message: "Deleted successfully", deletedBlog });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};
