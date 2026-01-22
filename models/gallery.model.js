const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["clinic", "treatment", "team"],
      required: true,
    },
  },
  { timestamps: true }
);

const Gallery = mongoose.model("Gallery", gallerySchema);

module.exports=Gallery