const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    description: {
      type: String,
    },

    causes: [
      {
        title: { type: String },
        description: { type: String },
      },
    ],

    exercises: [
      {
        name: { type: String },
        type: { type: String, enum: ["stretching", "strengthening"] },
        steps: [{ type: String }],
        image: { type: String },
      },
    ],

    managementTips: [
      {
        tipTitle: { type: String },
        details: { type: String },
      },
    ],
    image: {
      type: String,
    },
    author: {
      type: String,
      required: true,
    },
    publishedAt: {
      type: Date,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
