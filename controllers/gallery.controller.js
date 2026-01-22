const Gallery = require("../models/gallery.model");

module.exports.createGallery=async (req,res) => {
try {
  
    const {category} =req.body
     console.log(category);
    
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Image is required",
        });
      }
  
      console.log(req.file.path);
      
      if (!["clinic", "treatment", "team"].includes(category)) {
        return res.status(400).json({
          success: false,
          message: "Invalid category",
        });
      }
  
      const gallery = await Gallery.create({
        image: req.file.path, 
        category,
      });
  
      res.status(201).json({
        success: true,
        message: "Gallery image added successfully",
        data: gallery,
      });
 } catch (error) {
  res.status(500).json({message:"Something went wrong",error:error.message})
  } 
  
}

module.exports.getAllGallery=async (req,res) => {
  try {
    const gallery=await Gallery.find()
    if (gallery.length===0) {
     return res.status(400).json({message:"no any gallery is exists"})
    }
  
  
    res.status(200).json({message:"Galleries",gallery})
  } catch (error) {
    res.status(500).json({message:"Something went wrong",error:error.message})
  }
}

module.exports.deleteGallery=async (req,res) => {

  const id=req.params.id

  const deletedGallery=await Gallery.findByIdAndDelete(id)

  res.status(200).json({message:"Gallery has deleted",deletedGallery})
}